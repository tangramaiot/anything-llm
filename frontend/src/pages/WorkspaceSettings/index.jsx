import React, { useEffect, useState, memo, createContext } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Workspace from "@/models/workspace";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { isMobile } from "react-device-detect";
import { FullScreenLoader } from "@/components/Preloader";
import {
  ArrowUUpLeft,
  ChatText,
  Database,
  Robot,
  User,
  Wrench,
  X,
} from "@phosphor-icons/react";
import paths from "@/utils/paths";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import GeneralAppearance from "./GeneralAppearance";
import ChatSettings from "./ChatSettings";
import VectorDatabase from "./VectorDatabase";
import Members from "./Members";
import WorkspaceAgentConfiguration from "./AgentConfig";
import useUser from "@/hooks/useUser";
import { useTranslation } from "react-i18next";

const WorkspaceSettings = ({ hideSettings, slug, workspace }) => {
  const { user } = useUser();
  const [title, setTitle] = useState(null);
  const [tabContent, setTabContent] = useState(null);
  const { t } = useTranslation();

  const TABS = {
    "general": <GeneralAppearance slug={slug} workspace={workspace} hideSettings={hideSettings}/>,
    "vector": <VectorDatabase slug={slug} workspace={workspace} hideSettings={hideSettings}/>,
  };
  
  useEffect(() => {
    async function defaultTab() {
      setTabContent(TABS["general"]);
      setTitle(t("workspaces—settings.general"));
    }
    defaultTab();
  }, [])

  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-99">
      <div className="backdrop h-full w-full absolute top-0 z-10" />
      <div className="absolute w-[60%] transition duration-300 z-20">
        <div className="relative bg-main-gradient rounded-[12px] shadow border-2 border-slate-300/10">
          <div
            className="flex transition-all duration-500 relative md:rounded-[16px] bg-main-gradient w-full h-full py-2"
          >
            <button
              onClick={hideSettings}
              type="button"
              className="absolute right-2 z-50 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            >
              <X className="text-gray-300 text-lg" />
            </button>

            <div className="flex flex-col w-full px-4 py-4 gap-y-4">

              <div className="flex justify-center text-lm text-white/60">
                {title}
              </div>

              <div className="border border-slate-300/30"></div>

              <div className="flex">
                <div className="flex flex-col flex-1 w-1/5 gap-y-4">
                  <TabItem
                    index="general"
                    icon={<Wrench className="h-6 w-6" />}
                    setTitle={setTitle}
                    setTabContent={() => setTabContent(TABS["general"])}
                  />
                  <TabItem
                    index="vector"
                    icon={<Database className="h-6 w-6" />}
                    setTitle={setTitle}
                    setTabContent={() => setTabContent(TABS["vector"])}
                  />
                </div>
                <div className="flex-2 w-4/5">
                  {tabContent}
                </div>
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
          }
        }
        type="button"
        className="flex gap-x-2 items-center font-medium text-white/60 hover:text-sky-400"
      >
        {icon}
        <div>{t("workspaces—settings."+index)}</div>
      </button>
    </>
  );
}
export default memo(WorkspaceSettings);

export function useWorkspaceSettings() {
  const { user } = useUser();
  const [showing_settings, setShowingSettings] = useState(false);

  const showSettings = () => {
    if (user?.role !== "default") {
      setShowingSettings(true);
    }
  };

  const hideSettings = () => {
    setShowingSettings(false);
  };

  return { showing_settings, showSettings, hideSettings };
}
