import React, { useEffect, useRef, useState } from "react";
import { Plus, List } from "@phosphor-icons/react";
import NewWorkspaceModal, {
  useNewWorkspaceModal,
} from "../Modals/NewWorkspace";
import ActiveWorkspaces from "./ActiveWorkspaces";
import { USER_BACKGROUND_COLOR } from "@/utils/constants";
import useLogo from "@/hooks/useLogo";
import useUser from "@/hooks/useUser";
import Footer from "../Footer";
import SettingsButton from "../SettingsButton";
import { Link } from "react-router-dom";
import paths from "@/utils/paths";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { user } = useUser();
  const { logo } = useLogo();
  const sidebarRef = useRef(null);
  const {
    showing: showingNewWsModal,
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
  } = useNewWorkspaceModal();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <div
        className="flex shrink-0 items-center justify-start mx-[38px] mt-[18px]"
      >
        <img
          src={logo}
          alt="Logo"
          className="rounded max-h-[48px] object-contain"
        />
        <span className="text-2xl font-bold text-sidebar-text ml-2">
          賽亞 (SAI-A)
        </span>
      </div>
      <div
        ref={sidebarRef}
        className="relative m-[16px] rounded-[16px] bg-sidebar border-2 border-outline min-w-[250px] p-[10px] h-[calc(100%-76px)]"
      >
        <div className="flex flex-col h-full overflow-x-hidden">
          <div className="flex-grow flex flex-col min-w-[235px]">
            <div className="relative h-[calc(100%-60px)] flex flex-col w-full justify-between pt-[10px] overflow-y-scroll no-scroll">
              <div className="flex flex-col gap-y-2 pb-[60px] overflow-y-scroll no-scroll">
                <div className="flex gap-x-2 items-center justify-between">
                    {(!user || user?.role !== "default") && (
                      <button
                        onClick={showNewWsModal}
                        className="flex flex-grow w-[75%] h-[44px] gap-x-2 py-[5px] px-4 text-sidebar-text rounded-lg  justify-center items-center hover:bg-purple-600 bg-purple-500/50 transition-all duration-300"
                      >
                        <Plus className="h-5 w-5" />
                        <p className="text-sidebar-text text-sm font-semibold">
                          {t("new-workspace.title")}
                        </p>
                      </button>
                    )}
                  </div>
                <ActiveWorkspaces />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
    </div>
  );
}

export function SidebarMobileHeader() {
  const { logo } = useLogo();
  const sidebarRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showBgOverlay, setShowBgOverlay] = useState(false);
  const {
    showing: showingNewWsModal,
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
  } = useNewWorkspaceModal();
  const { user } = useUser();
  const { t } = useTranslation();

  useEffect(() => {
    // Darkens the rest of the screen
    // when sidebar is open.
    function handleBg() {
      if (showSidebar) {
        setTimeout(() => {
          setShowBgOverlay(true);
        }, 300);
      } else {
        setShowBgOverlay(false);
      }
    }
    handleBg();
  }, [showSidebar]);

  return (
    <>
      <div
        aria-label="Show sidebar"
        className="fixed top-0 left-0 right-0 z-10 flex px-4 py-2 text-sidebar-text shadow-lg h-16"
      >
        <button
          onClick={() => setShowSidebar(true)}
          className="rounded-md p-2 flex items-center justify-center text-sidebar-text"
        >
          <List className="h-6 w-6" />
        </button>
        <div className="flex items-center justify-center">
          <img
            src={logo}
            alt="Logo"
            className="block mx-auto h-6 w-auto"
            style={{ maxHeight: "40px", objectFit: "contain" }}
          />
          <span className="text-2xl font-bold text-sidebar-text ml-2">
            賽亞 (SAI-A)
          </span>
        </div>
        <div className="w-12"></div>
      </div>
      <div
        style={{
          transform: showSidebar ? `translateX(0vw)` : `translateX(-100vw)`,
        }}
        className={`z-99 fixed top-0 left-0 transition-all duration-500 w-[100vw] h-[100vh]`}
      >
        <div
          className={`${
            showBgOverlay
              ? "transition-all opacity-1"
              : "transition-none opacity-0"
          }  duration-500 fixed top-0 left-0 ${USER_BACKGROUND_COLOR} bg-opacity-75 w-screen h-screen`}
          onClick={() => setShowSidebar(false)}
        />
        <div
          ref={sidebarRef}
          className="relative h-[100vh] top-0 left-0 bg-neutral-800 rounded-r-[26px] w-[80%] p-[18px] "
        >
            {/* Primary Body */}
            <div className="flex flex-col h-full overflow-x-hidden">
            <div className="flex-grow flex flex-col min-w-[235px]">
              <div className="relative h-[calc(100%-60px)] flex flex-col w-full justify-between pt-[10px] overflow-y-scroll no-scroll">
                <div className="flex flex-col gap-y-2 pb-[60px] overflow-y-scroll no-scroll">
                  <div className="flex gap-x-2 items-center justify-between">
                      {(!user || user?.role !== "default") && (
                        <button
                          onClick={showNewWsModal}
                          className="flex flex-grow w-[75%] h-[44px] gap-x-2 py-[5px] px-4 text-sidebar-text rounded-lg  justify-center items-center hover:bg-purple-600 bg-purple-500/50 transition-all duration-300"
                        >
                          <Plus className="h-5 w-5" />
                          <p className="text-sidebar-text text-sm font-semibold">
                            {t("new-workspace.title")}
                          </p>
                        </button>
                      )}
                    </div>
                  <ActiveWorkspaces />
                </div>
              </div>
            </div>
          </div>
        </div>
        {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
      </div>
    </>
  );
}
