import System from "@/models/system";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { castToType } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import ChatHistorySettings from "./ChatHistorySettings";
import ChatPromptSettings from "./ChatPromptSettings";
import ChatTemperatureSettings from "./ChatTemperatureSettings";
import ChatModeSelection from "./ChatModeSelection";
import WorkspaceLLMSelection from "./WorkspaceLLMSelection";
import ChatQueryRefusalResponse from "./ChatQueryRefusalResponse";
import { useTranslation } from "react-i18next";

export default function ChatSettings({ slug, hideSettings }) {
  const [workspace, setWorkspace] = useState(null);
  const [settings, setSettings] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation();

  const formEl = useRef(null);
  useEffect(() => {
    async function fetchSettings() {
      const _settings = await System.keys();
      setSettings(_settings ?? {});
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    async function fetchWorkspace() {
      const workspace = await Workspace.bySlug(slug);
      setWorkspace(workspace);
    }
    fetchWorkspace();
  }, [slug]);

  const handleUpdate = async (e) => {
    setSaving(true);
    e.preventDefault();
    const data = {};
    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) data[key] = castToType(key, value);
    const { workspace: updatedWorkspace, message } = await Workspace.update(
      workspace.slug,
      data
    );
    if (!!updatedWorkspace) {
      showToast("Workspace updated!", "success", { clear: true });
    } else {
      showToast(`Error: ${message}`, "error", { clear: true });
    }
    setSaving(false);
    setHasChanges(false);
  };

  if (!workspace) return null;
  return (
    <div id="workspace-chat-settings-container">
      <form
        ref={formEl}
        onSubmit={handleUpdate}
        id="chat-settings-form"
        className="flex flex-col gap-y-6"
      >
        {/* <WorkspaceLLMSelection
          settings={settings}
          workspace={workspace}
          setHasChanges={setHasChanges}
        /> */}
        {/* <ChatModeSelection
          workspace={workspace}
          setHasChanges={setHasChanges}
        /> */}
        <ChatHistorySettings
          workspace={workspace}
          setHasChanges={setHasChanges}
        />
        <ChatPromptSettings
          workspace={workspace}
          setHasChanges={setHasChanges}
        />
        {/* <ChatQueryRefusalResponse
          workspace={workspace}
          setHasChanges={setHasChanges}
        /> */}
        <ChatTemperatureSettings
          settings={settings}
          workspace={workspace}
          setHasChanges={setHasChanges}
        />
        <div className="border border-slate-300/30"></div>
        <div className="flex justify-end">
          <div className="flex gap-x-2">
            <button
              type="button"
              onClick={hideSettings}
              className="transition-all w-fit duration-300 px-5 py-2 rounded-3xl text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              {t("general.cancel")}
            </button>
            <button
              disabled={!hasChanges}
              type="submit"
              className="transition-all w-fit duration-300 px-5 py-2 rounded-3xl text-white text-sm items-center flex gap-x-2  hover:text-slate-800 bg-gradient-to-b from-[#7F56D9] to-[#B043F2]"
            >
              {saving ? t("general.saving") : t("general.save")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
