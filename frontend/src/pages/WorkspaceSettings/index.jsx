import React, { useEffect, useState, memo, createContext } from "react";
import {
  ChatText,
  Database,
  User,
  Wrench,
  X,
  Trash,
} from "@phosphor-icons/react";
import GeneralAppearance from "./GeneralAppearance";
import ChatSettings from "./ChatSettings";
import VectorDatabase from "./VectorDatabase";
import Members from "./Members";
import useUser from "@/hooks/useUser";
import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";

const WorkspaceSettings = ({ hideSettings, slug, workspace }) => {
  const [title, setTitle] = useState(null);
  const [tabContent, setTabContent] = useState(null);
  const { t } = useTranslation();

  const TABS = {
    "general": <GeneralAppearance slug={slug} workspace={workspace} hideSettings={hideSettings}/>,
    "chat": <ChatSettings slug={slug} workspace={workspace} hideSettings={hideSettings}/>,
    "vector": <VectorDatabase slug={slug} workspace={workspace} hideSettings={hideSettings}/>,
    "members": <Members slug={slug} workspace={workspace} hideSettings={hideSettings}/>,
  };
  
  useEffect(() => {
    async function defaultTab() {
      setTabContent(TABS["general"]);
      setTitle(t("workspaces—settings.general"));
    }
    defaultTab();
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop - full screen on all devices */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal container with responsive width */}
      <div className="relative w-full mx-4 md:w-4/5 lg:w-3/5 xl:w-1/2 max-h-[90vh] transition duration-300 z-20">
        <div className="relative bg-main-gradient rounded-lg md:rounded-xl border border-slate-300/10 shadow-xl overflow-hidden">
          
          {/* Modal content */}
          <div className="flex flex-col w-full h-full">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4">
              <div className="flex-1 text-center text-white/60">
                {title}
              </div>
              <button
                onClick={hideSettings}
                className="p-1.5 rounded-lg hover:bg-menu-item-selected-gradient border border-transparent hover:border-slate-100/50 transition-colors"
              >
                <X className="text-gray-300 w-5 h-5" />
              </button>
            </div>

            <div className="border-t border-slate-300/30" />

            {/* Main content area */}
            <div className="flex flex-col md:flex-row p-4 gap-4 overflow-auto">
              {/* Sidebar - vertical on mobile, horizontal on desktop */}
              <div className="flex md:flex-col gap-4 md:w-1/5">
                <TabItem
                  index="general"
                  icon={<Wrench className="w-5 h-5 md:w-6 md:h-6" />}
                  setTitle={setTitle}
                  setTabContent={() => setTabContent(TABS["general"])}
                />
                <TabItem
                  index="chat"
                  icon={<ChatText className="w-5 h-5 md:w-6 md:h-6" />}
                  setTitle={setTitle}
                  setTabContent={() => setTabContent(TABS["chat"])}
                />
                <TabItem
                  index="vector"
                  icon={<Database className="w-5 h-5 md:w-6 md:h-6" />}
                  setTitle={setTitle}
                  setTabContent={() => setTabContent(TABS["vector"])}
                />
                <TabItem
                  index="members"
                  icon={<User className="w-5 h-5 md:w-6 md:h-6" />}
                  setTitle={setTitle}
                  setTabContent={() => setTabContent(TABS["members"])}
                />
              </div>

              {/* Content area */}
              <div className="flex-1 md:w-4/5">
                {tabContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabItem({ index, icon, setTitle, setTabContent }) {
  const { t } = useTranslation();
  return (
    <>
      <button
        onClick={() => {
          setTitle(t("workspaces—settings."+index));
          setTabContent();
        }}
        type="button"
        className="flex gap-x-1 sm:gap-x-2 items-center font-medium text-sm sm:text-base text-white/60 hover:text-sky-400 p-1 sm:p-2"
      >
        <span className="w-4 h-4 sm:w-5 sm:h-5">{icon}</span>
        <div className="truncate">{t("workspaces—settings."+index)}</div>
      </button>
    </>
  );
}
export default memo(WorkspaceSettings);

export function useWorkspaceSettings() {
  const { user } = useUser();
  const [showingSettings, setShowingSettings] = useState(false);

  const showSettings = () => {
    if (user?.role !== "default") {
      setShowingSettings(true);
    }
  };

  const hideSettings = () => {
    setShowingSettings(false);
  };

  return { showingSettings, showSettings, hideSettings };
}
