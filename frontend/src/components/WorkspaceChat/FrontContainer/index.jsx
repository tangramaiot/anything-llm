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
    <div className="w-full fixed md:absolute bottom-1 left-0 z-10 md:z-0 flex">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full"
      >
        <div className="flex mx-2 mb-1 md:mx-16 md:mb-2">
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
            className="cursor-text max-h-[50vh] md:max-h-[100px] md:mx-0 p-1 w-full text-[16px] md:text-md text-white bg-gray-700 bg-opacity-80 placeholder:text-white/60 resize-none active:outline-none focus:outline-none rounded-lg"
            placeholder={"Send a message"}
          />
          
          <div className="flex self-end my-2 mx-2 md:self-center">
            <button
              ref={formRef}
              type="submit"
              className="flex items-center justify-around rounded-full cursor-pointer text-white/60 hover:text-white bg-gradient-to-b from-[#7F56D9] to-[#B043F2] px-4 py-[10px]"
              data-tooltip-id="send-prompt"
              data-tooltip-content="Send prompt message to workspace"
              aria-label="Send prompt message to workspace"
            >
              <PaperPlaneRight className="w-5 h-5" weight="fill" />
            </button>
          </div>
        </div>
        {/* <div className="flex items-center ">
          <div className="w-full bg-gray-50/10 border border-white/10 rounded-2xl flex flex-col justify-stretch px-2 overflow-hidden">
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
              <button
                ref={formRef}
                type="submit"
                className="flex items-center justify-around rounded-full cursor-pointer text-white/60 hover:text-white bg-gradient-to-b from-[#7F56D9] to-[#B043F2] px-4 py-[10px]"
                data-tooltip-id="send-prompt"
                data-tooltip-content="Send prompt message to workspace"
                aria-label="Send prompt message to workspace"
              >
                <PaperPlaneRight className="w-5 h-5" weight="fill" />
              </button>
            </div>
          </div>
        </div> */}
      </form>
    </div>
  </div>
}