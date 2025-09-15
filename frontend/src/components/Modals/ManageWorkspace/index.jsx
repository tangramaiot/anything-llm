import React, { useState, useEffect, memo } from "react";
import { X } from "@phosphor-icons/react";
import { useParams } from "react-router-dom";
import Workspace from "../../../models/workspace";
import System from "../../../models/system";
import { isMobile } from "react-device-detect";
import useUser from "../../../hooks/useUser";
import DocumentSettings from "./Documents";
import DataConnectors from "./DataConnectors";

const noop = () => {};
const ManageWorkspace = ({ hideModal = noop, providedSlug = null }) => {
  const { slug } = useParams();
  const { user } = useUser();
  const [workspace, setWorkspace] = useState(null);
  const [settings, setSettings] = useState({});
  const [selectedTab, setSelectedTab] = useState("documents");

  useEffect(() => {
    async function getSettings() {
      const _settings = await System.keys();
      setSettings(_settings ?? {});
    }
    getSettings();
  }, []);

  useEffect(() => {
    async function fetchWorkspace() {
      const workspace = await Workspace.bySlug(providedSlug ?? slug);
      setWorkspace(workspace);
    }
    fetchWorkspace();
  }, [providedSlug, slug]);

  if (!workspace) return null;

  if (isMobile) {
    return (
      <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-99">
        <div className="backdrop h-full w-full absolute top-0 z-10" />
        <div className={`absolute max-h-full transition duration-300 z-20`}>
          <div className="relative max-w-lg mx-auto bg-main-gradient rounded-[12px] shadow border-2 border-slate-300/10">
            <div className="p-6">
              <h1 className="text-white text-lg font-semibold">
                Editing "{workspace.name}"
              </h1>
              <p className="text-white mt-4">
                Editing these settings are only available on a desktop device.
                Please access this page on your desktop to continue.
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={hideModal}
                  type="button"
                  className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-99 p-4">
      <div className="backdrop h-full w-full absolute top-0 z-10" />
      <div className="relative w-full max-w-7xl h-full max-h-[90vh] transition duration-300 z-20">
        <div className="relative bg-main-gradient rounded-2xl shadow border-2 border-slate-300/10 h-full flex flex-col overflow-hidden">
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={hideModal}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-700/50 rounded-lg text-sm p-2 inline-flex items-center transition-all duration-200"
            >
              <X className="text-gray-300 w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <DocumentSettings workspace={workspace} systemSettings={settings} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ManageWorkspace);

export function useManageWorkspaceModal() {
  const { user } = useUser();
  const [showingModal, setShowing] = useState(false);

  const showModal = () => {
    if (user?.role !== "default") {
      setShowing(true);
    }
  };

  const hideModal = () => {
    setShowing(false);
  };

  return { showingModal, showModal, hideModal };
}
