const { Time } = require("mssql");
const { toChunks } = require("../../helpers");
const Bottleneck = require("bottleneck");
const { log } = require("winston");

class AzureOpenAiEmbedder {
  constructor() {
    const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
    if (!process.env.AZURE_OPENAI_ENDPOINT)
      throw new Error("No Azure API endpoint was set.");
    if (!process.env.AZURE_OPENAI_KEY)
      throw new Error("No Azure API key was set.");

    const openai = new OpenAIClient(
      process.env.AZURE_OPENAI_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_OPENAI_KEY)
    );
    this.openai = openai;

    // Limit of how many strings we can process in a single pass to stay with resource or network limits
    // https://learn.microsoft.com/en-us/azure/ai-services/openai/faq#i-am-trying-to-use-embeddings-and-received-the-error--invalidrequesterror--too-many-inputs--the-max-number-of-inputs-is-1---how-do-i-fix-this-:~:text=consisting%20of%20up%20to%2016%20inputs%20per%20API%20request
    this.maxConcurrentChunks = 16;

    // https://learn.microsoft.com/en-us/answers/questions/1188074/text-embedding-ada-002-token-context-length
    this.embeddingMaxChunkLength = 2048;
   
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(
      Array.isArray(textInput) ? textInput : [textInput]
    );
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    const textEmbeddingModel =
      process.env.EMBEDDING_MODEL_PREF || "text-embedding-ada-002";
    if (!textEmbeddingModel)
      throw new Error(
        "No EMBEDDING_MODEL_PREF ENV defined. This must the name of a deployment on your Azure account for an embedding model."
      );

    //限速器
    const limiter = new Bottleneck({
      // reservoir: 100, // 初始可用的請求數
      // reservoirRefreshAmount: 100, // 每次刷新添加的請求數
      // reservoirRefreshInterval: 10*1000, // 刷新間隔
      // maxConcurrent: 16, // 最大并发請求數
      // minTime: 83, // 最小請求間隔
      reservoir: 35, // 最多可以執行35個請求
      reservoirRefreshAmount: 35, // 每次刷新時恢復35個
      reservoirRefreshInterval: 1000, // 每秒刷新一次（1000毫秒）
      minTime: 0, // 請求之間沒有強制的最小間隔時間
      maxConcurrent: 35 // 最多同時執行35個請求
    });
    limiter.on("depleted", (empty) => {
      log(`Rate limit depleted, ${empty ? 'completely empty' : 'some capacity left'}`);
    });
    
    limiter.on("failed", (error, jobInfo) => {
      log(`Job failed: ${error}, ${JSON.stringify(jobInfo)}`);
    });
    // Because there is a limit on how many chunks can be sent at once to Azure OpenAI
    // we concurrently execute each max batch of text chunks possible.
    // Refer to constructor maxConcurrentChunks for more info.

    // 指數退避函數
    function exponentialBackoff(fn, retries = 5, initialDelay = 1) {
      return fn().catch(err => {
        if (retries === 0) throw err;
        console.log(err?.code);
        if (err?.code === "429") {
          const match = message.match(/Please retry after (\d+) second/);
          console.log("Please retry after " + match[1] + " seconds");
          if (match) {
            const delay = parseInt(match[1], 10);
            return new Promise(resolve => setTimeout(resolve, delay * 1000)).then(() => exponentialBackoff(fn, retries - 1, initialDelay));
          }
        }
        return new Promise(resolve => setTimeout(resolve, initialDelay))
          .then(() => exponentialBackoff(fn, retries - 1, initialDelay * 1.5));
      });
    }
    const embeddingRequests = [];
    for (const chunk of toChunks(textChunks, this.maxConcurrentChunks)) {
        embeddingRequests.push(
          limiter.schedule(() =>
            new Promise((resolve) => {
              exponentialBackoff(() =>
              this.openai
                .getEmbeddings(textEmbeddingModel, chunk)
                .then((res) => {
                  const timestamp = new Date().toISOString();
                  console.log(timestamp, "embedding success");
                  resolve({ data: res.data, error: null });
                })
                .catch((e) => {
                  const timestamp = new Date().toISOString();
                  console.error(timestamp, "embedding error", e);
                  e.type =
                    e?.response?.data?.error?.code ||
                    e?.response?.status ||
                    "failed_to_embed";
                  e.message = e?.response?.data?.error?.message || e.message;
                  resolve({ data: [], error: e });
                })
              );
            })
          )
        );
    }

    const startTime = Date.now();
    const { data = [], error = null } = await Promise.all(
      embeddingRequests
    ).then((results) => {
      // If any errors were returned from Azure abort the entire sequence because the embeddings
      // will be incomplete.
      const errors = results
        .filter((res) => !!res.error)
        .map((res) => res.error)
        .flat();
      if (errors.length > 0) {
        let uniqueErrors = new Set();
        errors.map((error) =>
          uniqueErrors.add(`[${error.type}]: ${error.message}`)
        );

        return {
          data: [],
          error: Array.from(uniqueErrors).join(", "),
        };
      }
      return {
        data: results.map((res) => res?.data || []).flat(),
        error: null,
      };
    });

    const endTime = Date.now();
    console.log(
      `Azure OpenAI Embedding took ${(endTime - startTime) / 1000}s to complete.`
    );

    if (!!error) throw new Error(`Azure OpenAI Failed to embed: ${error}`);
    return data.length > 0 &&
      data.every((embd) => embd.hasOwnProperty("embedding"))
      ? data.map((embd) => embd.embedding)
      : null;
  }
}

module.exports = {
  AzureOpenAiEmbedder,
};
