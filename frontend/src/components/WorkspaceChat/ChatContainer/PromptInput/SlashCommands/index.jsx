import { useEffect, useRef, useState } from "react";
import SlashCommandIcon from "./icons/slash-commands-icon.svg";
import { Tooltip } from "react-tooltip";
import ResetCommand from "./reset";
import EndAgentSession from "./endAgentSession";
import SlashPresets from "./SlashPresets";

export default function SlashCommandsButton({ showing, setShowSlashCommand }) {
  return (
    <div
      id="slash-cmd-btn"
      data-tooltip-id="tooltip-slash-cmd-btn"
      data-tooltip-content="View all available slash commands for chatting."
      onClick={() => setShowSlashCommand(!showing)}
      className={`flex justify-center items-center opacity-60 hover:opacity-100 cursor-pointer ${
        showing ? "!opacity-100" : ""
      }`}
    >
      <img
        src={SlashCommandIcon}
        className="w-6 h-6 pointer-events-none"
        alt="Slash commands button"
      />
      <Tooltip
        id="tooltip-slash-cmd-btn"
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </div>
  );
}

export function SlashCommands({ showing, setShowing, sendCommand }) {
  const cmdRef = useRef(null);
  useEffect(() => {
    function listenForOutsideClick() {
      if (!showing || !cmdRef.current) return false;
      document.addEventListener("click", closeIfOutside);
    }
    listenForOutsideClick();
  }, [showing, cmdRef.current]);

  const closeIfOutside = ({ target }) => {
    if (target.id === "slash-cmd-btn") return;
    const isOutside = !cmdRef?.current?.contains(target);
    if (!isOutside) return;
    setShowing(false);
  };

  return (
    <div hidden={!showing}>
      <div className="w-full flex justify-center absolute bottom-[100px] md:bottom-[120px] lg:bottom-[140px] left-0 z-20 px-3 md:px-6">
        <div
          ref={cmdRef}
          className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[60vh] overflow-auto p-3 md:p-4 bg-zinc-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-zinc-700/50 flex-col justify-center items-start gap-2.5 inline-flex"
        >
          <ResetCommand sendCommand={sendCommand} setShowing={setShowing} />
          <EndAgentSession sendCommand={sendCommand} setShowing={setShowing} />
          <SlashPresets sendCommand={sendCommand} setShowing={setShowing} />
        </div>
      </div>
    </div>
  );
}

export function useSlashCommands() {
  const [showSlashCommand, setShowSlashCommand] = useState(false);
  return { showSlashCommand, setShowSlashCommand };
}
