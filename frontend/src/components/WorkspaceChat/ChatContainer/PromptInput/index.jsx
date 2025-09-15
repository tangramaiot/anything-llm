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
    <div className="w-full bg-gradient-to-t from-gray-900/95 to-transparent backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full"
      >
        <div className="flex mx-3 mb-2 md:mx-6 lg:mx-12 xl:mx-16 md:mb-3 lg:mb-4">
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
            className="cursor-text max-h-[40vh] md:max-h-[120px] lg:max-h-[150px] p-2 md:p-3 w-full text-sm md:text-base text-white bg-gray-700/90 placeholder:text-white/60 resize-none active:outline-none focus:outline-none rounded-lg border border-gray-600/50 focus:border-purple-500/50 transition-colors"
            placeholder={"Send a message"}
            rows="1"
          />
          
          <div className="flex self-end ml-2 md:ml-3 mb-1 md:mb-2 lg:mb-3">
            {buttonDisabled ? (
              <StopGenerationButton />
            ) : (
              <>
                <button
                  ref={formRef}
                  type="submit"
                  className="flex items-center justify-center rounded-full cursor-pointer text-white/60 hover:text-white bg-gradient-to-b from-[#7F56D9] to-[#B043F2] hover:from-[#8B66E3] hover:to-[#B84EF4] p-2.5 md:p-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-tooltip-id="send-prompt"
                  data-tooltip-content="Send prompt message to workspace"
                  aria-label="Send prompt message to workspace"
                  disabled={inputDisabled}
                >
                  <PaperPlaneRight className="w-4 h-4 md:w-5 md:h-5" weight="fill" />
                </button>
                <Tooltip
                  id="send-prompt"
                  place="bottom"
                  delayShow={300}
                  className="tooltip !text-xs z-99"
                />
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
