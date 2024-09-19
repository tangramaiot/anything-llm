import React, { useState, useEffect, useCallback, useRef } from "react";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Workspace from "@/models/workspace";
import ManageWorkspace, {
  useManageWorkspaceModal,
} from "../../Modals/ManageWorkspace";
import WorkspaceSettings, {
  useWorkspaceSettings,
} from "../../../pages/WorkspaceSettings";
import paths from "@/utils/paths";
import { useParams, useNavigate } from "react-router-dom";
import { GearSix, Database, DotsThree, Trash, Plus, X, Check } from "@phosphor-icons/react";
import AgentItem from "@/media/agents/agentitem.png";
import truncate from "truncate";
import useUser from "@/hooks/useUser";
import ThreadContainer from "./ThreadContainer";
import { useTranslation } from "react-i18next";
import { PROMPT_INPUT_EVENT } from "../../WorkspaceChat/FrontContainer";
import showToast from "@/utils/toast";

export default function ActiveWorkspaces() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWs, setSelectedWs] = useState(null);
  const [hoverStates, setHoverStates] = useState({});
  const [gearHover, setGearHover] = useState({});
  const [uploadHover, setUploadHover] = useState({});
  const { showingModal, showModal, hideModal } = useManageWorkspaceModal();
  const { showingSettings, showSettings, hideSettings } = useWorkspaceSettings();
  const [ showingDelete, showDelete] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const optionsContainer = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    async function getWorkspaces() {
      const workspaces = await Workspace.all();
      setLoading(false);
      setWorkspaces(workspaces);
    }
    getWorkspaces();

    // 在 component mount 時添加事件監聽
    window.addEventListener("addWorkspace", getWorkspaces);

    // 在 component unmount 時移除事件監聽，避免內存洩漏
    return () => {
      window.removeEventListener("addWorkspace", getWorkspaces);
    };
  }, []);

  const handleMouseEnter = useCallback((workspaceId) => {
    setHoverStates((prev) => ({ ...prev, [workspaceId]: true }));
  }, []);

  const handleMouseLeave = useCallback((workspaceId) => {
    setHoverStates((prev) => ({ ...prev, [workspaceId]: false }));
    setShowOptions(false);
  }, []);
  const handleGearMouseEnter = useCallback((workspaceId) => {
    setGearHover((prev) => ({ ...prev, [workspaceId]: true }));
  }, []);

  const handleGearMouseLeave = useCallback((workspaceId) => {
    setGearHover((prev) => ({ ...prev, [workspaceId]: false }));
  }, []);

  const handleUploadMouseEnter = useCallback((workspaceId) => {
    setUploadHover((prev) => ({ ...prev, [workspaceId]: true }));
  }, []);

  const handleUploadMouseLeave = useCallback((workspaceId) => {
    setUploadHover((prev) => ({ ...prev, [workspaceId]: false }));
  }, []);

  if (loading) {
    return (
      <>
        <Skeleton.default
          height={36}
          width="100%"
          count={3}
          baseColor="#292524"
          highlightColor="#4c4948"
          enableAnimation={true}
        />
      </>
    );
  }

  const deleteWorkspace = async () => {
    const success = await Workspace.delete(slug);
    showDelete(false);
    if (!success) {
      showToast("Workspace could not be deleted!", "error", { clear: true });
      return;
    }
    const workspaces = await Workspace.all();
    setLoading(false);
    setWorkspaces(workspaces);
  };

  return (
    <div role="list" aria-label="Workspaces" className="flex flex-col gap-y-2">
      {workspaces.map((workspace) => {
        const isActive = workspace.slug === slug;
        const isHovered = hoverStates[workspace.id];
        return (
            <div
              className="flex flex-col w-full"
              onMouseEnter={() => handleMouseEnter(workspace.id)}
              onMouseLeave={() => handleMouseLeave(workspace.id)}
              key={workspace.id}
              role="listitem"
            >
              <div
                key={workspace.id}
                className="flex gap-x-2 items-center justify-between"
              >
                <a
                  onClick={isActive ? null : () => navigate(paths.workspace.chat(workspace.slug))}
                  aria-current={isActive ? "page" : ""}
                  className={`
                transition-all duration-[200ms]
                  flex flex-grow w-[75%] gap-x-2 py-[6px] px-[12px] rounded-[4px] text-white justify-start items-center
                  hover:bg-workspace-item-selected-gradient hover:font-bold
                  ${
                    isActive
                      ? "bg-workspace-item-selected-gradient font-bold"
                      : ""
                  }`}
                >
                  <div className="flex flex-row justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <img
                        src={AgentItem}
                        alt="AgentItem"
                        className="flex-shrink-0"
                      />
                      <p
                        className={`text-[14px] leading-loose whitespace-nowrap overflow-hidden ${
                          isActive ? "text-white " : "text-zinc-200"
                        }`}
                      >
                        {isActive || isHovered
                          ? truncate(workspace.name, 15)
                          : truncate(workspace.name, 20)}
                      </p>
                    </div>
                    {(isActive || isHovered || gearHover[workspace.id]) &&
                    user?.role !== "default" ? (
                      <div>
                        <div
                          className={`flex hover:bg-[#646768] p-[2px] rounded-[4px] text-[#A7A8A9] hover:text-white ${
                            uploadHover[workspace.id] ? "bg-[#646768]" : ""
                          }`}
                        >
                          <button
                            type="button"
                            className="border-none"
                            onClick={() => setShowOptions(!showOptions)}
                            aria-label="Thread options"
                          >
                            <DotsThree className="text-slate-300" size={25} />
                          </button>
                        </div>
                        {showOptions && (
                          <OptionsMenu
                            containerRef={optionsContainer}
                            workspace={workspace}
                            setSelectedWs={setSelectedWs}
                            showModal={showModal}
                            showSettings={showSettings}
                            showDelete={showDelete}
                            close={() => setShowOptions(false)}
                          />
                        )}
                      </div>
                    ) : null}
                  </div>
                </a>
              </div>
              <div className="py-1">
                {isActive && (
                  <ThreadContainer workspace={workspace} isActive={isActive} />
                )}
              </div>
            </div>
        );
      })}
      {showingModal && (
        <ManageWorkspace
          hideModal={hideModal}
          providedSlug={selectedWs ? selectedWs.slug : null}
        />
      )}
      {showingSettings && (
        <WorkspaceSettings
          hideSettings={hideSettings}
          slug={slug}
          workspace={workspaces.filter(workspace => workspace.slug === slug)[0]}
        />
      )}
      {showingDelete && (
        <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-99">
          <div className="backdrop h-full w-full absolute top-0 z-10" />
          <div className="absolute transition duration-300 z-20">
            <div className="relative bg-white rounded-lg w-[400px]">
              <div
                className="flex flex-col transition-all duration-500 relative py-5 px-5 gap-10"
              >
                <div className="flex flex-col gap-5">
                  <p className="text-black text-lg flex justify-center font-extrabold">{t("delete-workspace.title")}</p>
                  <p className="text-black text-lg flex justify-center font-medium">{t("delete-workspace.description")}</p>
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      showDelete(false);
                    }}
                    type="button"
                    className="rounded-md flex items-center justify-center p-2 bg-white border border-purple-600 text-purple-600 hover:text-purple-600/50 w-32 gap-2"
                    >
                    <X size={18} />
                    <p className="text-xs">
                    {t("delete-workspace.cancel")}</p>
                  </button>
                  <button
                    onClick={deleteWorkspace}
                    type="button"
                    className="rounded-md flex items-center justify-center p-2 gap-2 bg-purple-600/40 hover:bg-purple-500 text-white w-32"
                  >
                    <Check size={18} />
                    <p className="text-xs">
                    {t("delete-workspace.confirm")}</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OptionsMenu({ containerRef, workspace, setSelectedWs, showModal, showSettings, showDelete, close }) {
  const { t } = useTranslation();
  const menuRef = useRef(null);

  // Ref menu options
  const outsideClick = (e) => {
    if (!menuRef.current) return false;
    if (
      !menuRef.current?.contains(e.target) &&
      !containerRef.current?.contains(e.target)
    )
      close();
    return false;
  };

  const isEsc = (e) => {
    if (e.key === "Escape" || e.key === "Esc") close();
  };

  function cleanupListeners() {
    window.removeEventListener("click", outsideClick);
    window.removeEventListener("keyup", isEsc);
  }
  // end Ref menu options

  useEffect(() => {
    function setListeners() {
      if (!menuRef?.current || !containerRef.current) return false;
      window.document.addEventListener("click", outsideClick);
      window.document.addEventListener("keyup", isEsc);
    }

    setListeners();
    return cleanupListeners;
  }, [menuRef.current, containerRef.current]);

  const renameThread = async () => {
    const name = window
      .prompt("What would you like to rename this thread to?")
      ?.trim();
    if (!name || name.length === 0) {
      close();
      return;
    }

    const { message } = await Workspace.threads.update(
      workspace.slug,
      thread.slug,
      { name }
    );
    if (!!message) {
      showToast(`Thread could not be updated! ${message}`, "error", {
        clear: true,
      });
      close();
      return;
    }

    thread.name = name;
    close();
  };

  return (
    <div
      ref={menuRef}
      className="absolute w-fit z-[20] right-[10px] bg-white rounded-lg p-1"
    >
      <button
        onClick={() => {
          window.dispatchEvent(
            new CustomEvent(PROMPT_INPUT_EVENT, { detail: "" })
          );
          close();
        }}
        type="button"
        className="w-full rounded-md flex items-center p-2 gap-x-2 hover:bg-slate-500/20 text-black hover:text-purple-500"
      >
        <Plus size={18} />
        <p className="text-sm">{t("workspace-menu.new-chart")}</p>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          showSettings();
        }}
        type="button"
        className="w-full rounded-md flex items-center p-2 gap-x-2 hover:bg-slate-500/20 text-black hover:text-purple-500"
      >
        <GearSix size={18} />
        <p className="text-sm">{t("workspace-menu.settings")}</p>
      </button>
      <button
        onClick={(e) => {
          console.log("delete workspace");
          e.preventDefault();
          setSelectedWs(workspace);
          showModal();
        }}
        type="button"
        className="w-full rounded-md flex items-center p-2 gap-x-2 hover:bg-slate-500/20 text-black hover:text-purple-500"
      >
        <Database size={18} />
        <p className="text-sm">{t("workspace-menu.upload-documentation")}</p>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          showDelete(true);
        }}
        type="button"
        className="w-full rounded-md flex items-center p-2 gap-x-2 hover:bg-slate-500/20 text-black hover:text-purple-500"
      >
        <Trash size={18} />
        <p className="text-sm">{t("workspace-menu.delete")}</p>
      </button>
    </div>
  );
}
