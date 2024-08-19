import React, { useState, useRef, useEffect } from "react";
import SlashCommandsButton, {
  SlashCommands,
  useSlashCommands,
} from "./SlashCommands";
import debounce from "lodash.debounce";
import { PaperPlaneRight } from "@phosphor-icons/react";
import StopGenerationButton from "./StopGenerationButton";
import AvailableAgentsButton, {
  AvailableAgents,
  useAvailableAgents,
} from "./AgentMenu";
import { Tooltip } from "react-tooltip";

export const PROMPT_INPUT_EVENT = "set_prompt_input";
export default function PromptInput({
  submit,
  onChange,
  inputDisabled,
  buttonDisabled,
  sendCommand,
}) {
  const [promptInput, setPromptInput] = useState("");
  const { showAgents, setShowAgents } = useAvailableAgents();
  const { showSlashCommand, setShowSlashCommand } = useSlashCommands();
  const formRef = useRef(null);
  const textareaRef = useRef(null);
  const [_, setFocused] = useState(false);

  // To prevent too many re-renders we remotely listen for updates from the parent
  // via an event cycle. Otherwise, using message as a prop leads to a re-render every
  // change on the input.
  function handlePromptUpdate(e) {
    setPromptInput(e?.detail ?? "");
  }

  useEffect(() => {
    if (!!window)
      window.addEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
    return () =>
      window?.removeEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
  }, []);

  useEffect(() => {
    if (!inputDisabled && textareaRef.current) {
      textareaRef.current.focus();
    }
    resetTextAreaHeight();
  }, [inputDisabled]);

  const handleSubmit = (e) => {
    setFocused(false);
    submit(e);
  };

  const resetTextAreaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const checkForSlash = (e) => {
    const input = e.target.value;
    if (input === "/") setShowSlashCommand(true);
    if (showSlashCommand) setShowSlashCommand(false);
    return;
  };

  const checkForAt = (e) => {
    const input = e.target.value;
    if (input === "@") return setShowAgents(true);
    if (showAgents) return setShowAgents(false);
  };

  const captureEnter = (event) => {
    if (event.keyCode == 13) {
      if (!event.shiftKey) {
        submit(event);
      }
    }
  };

  const adjustTextArea = (event) => {
    const element = event.target;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const watchForSlash = debounce(checkForSlash, 300);
  const watchForAt = debounce(checkForAt, 300);

  return (
    <div className="w-full fixed md:absolute bottom-0 left-0 z-10 md:z-0 flex">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full mx-10"
      >
        <div className="flex items-center md:mb-4">
          <div className="w-full bg-gray-50/10 border border-white/10 rounded-2xl flex flex-col justify-stretch px-5 overflow-hidden">
            <div className="flex w-full">
              <textarea
                ref={textareaRef}
                onChange={(e) => {
                  onChange(e);
                  watchForSlash(e);
                  watchForAt(e);
                  adjustTextArea(e);
                  setPromptInput(e.target.value);
                }}
                onKeyDown={captureEnter}
                required={true}
                disabled={inputDisabled}
                onFocus={() => setFocused(true)}
                onBlur={(e) => {
                  setFocused(false);
                  adjustTextArea(e);
                }}
                value={promptInput}
                className="cursor-text max-h-[50vh] md:max-h-[100px] my-2 mx-2 md:mx-0 w-full text-[16px] md:text-md text-white bg-transparent placeholder:text-white/60 resize-none active:outline-none focus:outline-none"
                placeholder={"Send a message"}
              />
              {buttonDisabled ? (
                <StopGenerationButton />
              ) : (
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
                  <Tooltip
                    id="send-prompt"
                    place="bottom"
                    delayShow={300}
                    className="tooltip !text-xs z-99"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
