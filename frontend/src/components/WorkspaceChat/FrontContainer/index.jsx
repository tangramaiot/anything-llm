import React, { useState, useRef, useEffect } from "react";
import { PaperPlaneRight } from "@phosphor-icons/react";

export const PROMPT_INPUT_EVENT = "set_prompt_input";

export default function FrontContainer() {

  const [promptInput, setPromptInput] = useState("");
  const formRef = useRef(null);
  const textareaRef = useRef(null);
  const [_, setFocused] = useState(false);
  const [message, setMessage] = useState("");

  function handlePromptUpdate(e) {
    setPromptInput(e?.detail ?? "");
  }

  function setMessageEmit(messageContent = "") {
    setMessage(messageContent);
    window.dispatchEvent(
      new CustomEvent(PROMPT_INPUT_EVENT, { detail: messageContent })
    );
  }

  useEffect(() => {
    if (!!window)
      window.addEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
    return () =>
      window?.removeEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message || message === "") return false;
    setMessageEmit("");
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  return <div className="flex flex-col flex-grow w-full h-full items-center justify-center">
    <div className="flex flex-col items-center my-7">
      <span className="text-3xl font-bold text-white my-2"> Welcome to SAI-A </span>
      <span className="text-lg text-white my-2"> 您的最佳人工智能助理 </span>
    </div>
    <div className="flex items-center text-white my-7 border border-white/50 rounded-[10px]">
        <form
          onSubmit={handleSubmit}
          className="flex w-[50vw] my-2 mx-2 items-center justify-center gap-2"
        >
          <div className="grow">
            <textarea
              ref={textareaRef}
              onChange={(e) => {
                handleMessageChange(e);
                setPromptInput(e.target.value);
              }}
              required={true}
              onFocus={() => setFocused(true)}
              onBlur={(e) => {
                setFocused(false);
              }}
              value={promptInput}
              className="cursor-text md:max-h-[100px] py-2 w-full text-[16px] md:text-md text-white bg-transparent placeholder:text-white/60 resize-none active:outline-none focus:outline-none flex-grow"
              placeholder={"Send a message"}
            />
          </div>
          <div className="grow-0">
            <button
              ref={formRef}
              type="submit"
              className="inline-flex items-center justify-around rounded-lg bg-gradient-to-b from-[#7F56D9] to-[#B043F2] py-[10px] w-11 h-11"
              data-tooltip-id="send-prompt"
              data-tooltip-content="Send prompt message to workspace"
              aria-label="Send prompt message to workspace"
            >
              <PaperPlaneRight className="w-5 h-5" weight="fill" />
            </button>
          </div>
        </form>
    </div>
  </div>
}