import React, { useState, useRef, useEffect } from "react";
import { PaperPlaneRight, MagnifyingGlass, PencilSimpleLine, Translate } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export const PROMPT_INPUT_EVENT = "front_set_prompt_input";

export default function FrontContainer() {

  const [promptInput, setPromptInput] = useState("");
  const formRef = useRef(null);
  const textareaRef = useRef(null);
  const [_, setFocused] = useState(false);
  const { t } = useTranslation();

  function handlePromptUpdate(e) {
    setPromptInput(e?.detail ?? "");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    window.dispatchEvent(
      new CustomEvent(PROMPT_INPUT_EVENT, { detail: promptInput })
    );
    handlePromptUpdate("");
  };

  const captureEnter = (event) => {
    if (event.keyCode == 13) {
      if (!event.shiftKey) {
        handleSubmit(event);
      }
    }
  };

  const adjustTextArea = (event) => {
    const element = event.target;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  return <div className="absolute w-full h-full">
    <div className="flex flex-col items-center mt-60">
      <span className="text-3xl font-bold text-white my-2"> {t("welcomeMessage.main")}  </span>
      <span className="text-lg text-white my-2"> {t("welcomeMessage.sub")} </span>
    </div>
    <div className="flex items-center justify-center mt-20 px-4 ">
      <button
        ref={formRef}
        type="submit"
        className="flex flex-col items-center justify-around border border-white rounded-xl cursor-pointer text-white/60 hover:bg-gray-200/10 w-[234px] h-[126px] px-4 py-3 mx-6"
        data-tooltip-id="send-prompt"
        data-tooltip-content="Send prompt message to workspace"
        aria-label="Send prompt message to workspace"
      >
        <MagnifyingGlass className="w-6 h-6 mb-2" weight="bold" />
        <span className="text-lg text-white"> {t("welcomeMessage.function1.title")} </span>
        <span className="text-sm text-white"> {t("welcomeMessage.function1.description")} </span>
      </button>
      <button
        ref={formRef}
        type="submit"
        className="flex flex-col items-center justify-around border border-white rounded-xl cursor-pointer text-white/60 hover:bg-gray-200/10 w-[234px] h-[126px] px-4 py-3 mx-6"
        data-tooltip-id="send-prompt"
        data-tooltip-content="Send prompt message to workspace"
        aria-label="Send prompt message to workspace"
      >
        <PencilSimpleLine className="w-6 h-6 mb-2" weight="bold" />
        <span className="text-lg text-white"> {t("welcomeMessage.function2.title")} </span>
        <span className="text-sm text-white "> {t("welcomeMessage.function2.description")} </span>
      </button>
      <button
        ref={formRef}
        type="submit"
        className="flex flex-col items-center justify-around border border-white rounded-xl cursor-pointer text-white/60 hover:bg-gray-200/10 w-[234px] h-[126px] px-4 py-3 mx-6"
        data-tooltip-id="send-prompt"
        data-tooltip-content="Send prompt message to workspace"
        aria-label="Send prompt message to workspace"
      >
        <Translate className="w-6 h-6 mb-2" weight="bold" />
        <span className="text-lg text-white"> {t("welcomeMessage.function3.title")} </span>
        <span className="text-sm text-white"> {t("welcomeMessage.function3.description")} </span>
      </button>
    </div>
    <div className="w-full fixed md:absolute bottom-0 left-0 z-10 md:z-0 flex">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full mx-10"
      >
        <div className="flex items-center md:mb-4">
          <div className="w-full bg-gray-50/10 border border-white/10 rounded-2xl flex flex-col justify-stretch px-5 overflow-hidden">
            <div className="flex">
              <textarea
                ref={textareaRef}
                onChange={(e) => {
                  adjustTextArea(e);
                  setPromptInput(e.target.value);
                }}
                onKeyDown={captureEnter}
                required={true}
                onFocus={() => setFocused(true)}
                onBlur={(e) => {
                  setFocused(false);
                  adjustTextArea(e);
                }}
                value={promptInput}
                className="cursor-text max-h-[50vh] md:max-h-[100px] my-2 mx-2 md:mx-0 w-full text-[16px] md:text-md text-white bg-transparent placeholder:text-white/60 resize-none active:outline-none focus:outline-none"
                placeholder={"Send a message"}
              />
              <div className="flex flex-col-reverse mx-1 my-2">
                <button
                  ref={formRef}
                  type="submit"
                  className="flex items-center justify-around rounded-3xl cursor-pointer text-white/60 hover:text-white bg-gradient-to-b from-[#7F56D9] to-[#B043F2] px-4 py-[10px] w-[100px]"
                  data-tooltip-id="send-prompt"
                  data-tooltip-content="Send prompt message to workspace"
                  aria-label="Send prompt message to workspace"
                >
                  Send
                  <PaperPlaneRight className="w-5 h-5" weight="fill" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
}