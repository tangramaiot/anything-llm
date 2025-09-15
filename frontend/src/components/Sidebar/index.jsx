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
    <div className="flex flex-col w-full max-w-xs xl:max-w-sm h-screen overflow-hidden">
      {/* Header with responsive logo and title */}
      <div className="flex shrink-0 items-center justify-start mx-4 lg:mx-6 xl:mx-8 mt-4 lg:mt-6 mb-2">
        <img
          src={logo}
          alt="Logo"
          className="rounded max-h-8 lg:max-h-10 xl:max-h-12 object-contain flex-shrink-0"
        />
        <span className="text-lg lg:text-xl xl:text-2xl font-bold text-sidebar-text ml-2 truncate">
          賽亞 (SAI-A)
        </span>
      </div>
      
      {/* Main sidebar content */}
      <div
        ref={sidebarRef}
        className="relative m-3 lg:m-4 mt-0 rounded-2xl bg-sidebar border-2 border-outline w-auto min-w-0 p-2 lg:p-3 flex-1 flex flex-col overflow-hidden"
      >
        {/* New workspace button - fixed at top */}
        {(!user || user?.role !== "default") && (
          <div className="flex-shrink-0 mb-3">
            <button
              onClick={showNewWsModal}
              className="flex w-full h-10 lg:h-11 gap-x-2 py-2 px-3 lg:px-4 text-sidebar-text rounded-lg justify-center items-center hover:bg-purple-600 bg-purple-500/50 transition-all duration-300"
            >
              <Plus className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
              <p className="text-sidebar-text text-xs lg:text-sm font-semibold truncate">
                {t("new-workspace.title")}
              </p>
            </button>
          </div>
        )}
        
        {/* Scrollable content area */}
        <div 
          className="flex-1 sidebar-scrollbar" 
          style={{
            overflowY: 'auto', 
            minHeight: 0,
            maxHeight: '100%'
          }}
        >
          <ActiveWorkspaces />
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

  // 監聽側邊欄事件
  useEffect(() => {
    const handleSidebarToggle = (event) => {
      setShowSidebar(event.detail.isVisible);
    };

    // 添加事件監聽器
    window.addEventListener("toggleSidebar", handleSidebarToggle);

    // 清理事件監聽器
    return () => {
      window.removeEventListener("toggleSidebar", handleSidebarToggle);
    };
  }, []);

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
      {/* Mobile header bar with responsive design */}
      <div
        aria-label="Show sidebar"
        className="fixed top-0 left-0 right-0 flex items-center px-3 sm:px-4 py-3 text-sidebar-text shadow-lg h-14 sm:h-16 bg-neutral-800 z-50"
      >
        <button
          onClick={() => setShowSidebar(true)}
          className="rounded-md p-2 flex items-center justify-center text-sidebar-text hover:bg-neutral-700 transition-colors"
        >
          <List className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        
        {/* Centered logo and title */}
        <div className="flex items-center justify-center flex-1 mx-4">
          <img
            src={logo}
            alt="Logo"
            className="block h-6 sm:h-8 w-auto object-contain flex-shrink-0"
          />
          <span className="text-lg sm:text-xl font-bold text-sidebar-text ml-2 truncate">
            賽亞 (SAI-A)
          </span>
        </div>
        
        {/* Spacer to balance the layout */}
        <div className="w-9 sm:w-12"></div>
      </div>
      
      {/* Mobile sidebar overlay */}
      <div
        style={{
          transform: showSidebar ? `translateX(0)` : `translateX(-100%)`,
        }}
        className={`z-[99] fixed top-0 left-0 transition-transform duration-500 ease-in-out w-full h-full`}
      >
        {/* Background overlay */}
        <div
          className={`${
            showBgOverlay
              ? "opacity-75"
              : "opacity-0"
          } transition-opacity duration-500 fixed inset-0 ${USER_BACKGROUND_COLOR} bg-opacity-75`}
          onClick={() => setShowSidebar(false)}
        />
        
        {/* Sidebar panel */}
        <div
          ref={sidebarRef}
          className="relative h-full bg-neutral-800 rounded-r-3xl w-[85%] sm:w-[75%] md:w-[65%] max-w-sm p-4 sm:p-6 flex flex-col"
        >
          {/* New workspace button for mobile - fixed at top */}
          {(!user || user?.role !== "default") && (
            <div className="flex-shrink-0 mb-3">
              <button
                onClick={showNewWsModal}
                className="flex w-full h-11 gap-x-2 py-2 px-4 text-sidebar-text rounded-lg justify-center items-center hover:bg-purple-600 bg-purple-500/50 transition-all duration-300"
              >
                <Plus className="h-5 w-5 flex-shrink-0" />
                <p className="text-sidebar-text text-sm font-semibold truncate">
                  {t("new-workspace.title")}
                </p>
              </button>
            </div>
          )}
          
          {/* Scrollable content area */}
          <div 
            className="flex-1 sidebar-scrollbar" 
            style={{
              overflowY: 'auto', 
              minHeight: 0,
              maxHeight: '100%'
            }}
          >
            <ActiveWorkspaces />
          </div>
        </div>
        {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
      </div>
    </>
  );
}
