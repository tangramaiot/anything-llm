import Workspace from "@/models/workspace";
import { castToType } from "@/utils/types";
import showToast from "@/utils/toast";
import { useEffect, useRef, useState } from "react";
import WorkspaceName from "./WorkspaceName";
import DeleteWorkspace from "./DeleteWorkspace";
import WorkspacePfp from "./WorkspacePfp";
import { useTranslation } from "react-i18next";

export default function GeneralInfo({ slug, hideSettings }) {
  const [workspace, setWorkspace] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const formEl = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchWorkspace() {
      const workspace = await Workspace.bySlug(slug);
      setWorkspace(workspace);
      setLoading(false);
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

  if (!workspace || loading) return null;
  return (
    <div className="h-full flex flex-col">
      <form
        ref={formEl}
        onSubmit={handleUpdate}
        className="h-full flex flex-col"
      >
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto pr-4 -mr-4 min-h-0">
          <div className="flex flex-col gap-y-4 md:gap-y-6 pb-4 md:pb-6">
            <WorkspacePfp workspace={workspace} slug={slug} />
            <WorkspaceName
              key={workspace.slug}
              workspace={workspace}
              setHasChanges={setHasChanges}
            />
            {/* <SuggestedChatMessages slug={workspace.slug} /> */}
            {/* <DeleteWorkspace workspace={workspace} /> */}
          </div>
        </div>
        
        {/* Fixed button area at bottom - always visible */}
        <div className="flex-shrink-0 border-t border-slate-300/30 pt-3 md:pt-4 min-h-[60px]">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-end">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-x-2">
              <button
                type="button"
                onClick={hideSettings}
                className="transition-all w-full sm:w-fit duration-300 px-4 md:px-5 py-2 rounded-3xl text-white text-sm items-center flex justify-center gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              >
                {t("general.cancel")}
              </button>
              <button
                disabled={!hasChanges}
                type="submit"
                className="transition-all w-full sm:w-fit duration-300 px-4 md:px-5 py-2 rounded-3xl text-white text-sm items-center flex justify-center gap-x-2 hover:text-slate-800 bg-gradient-to-b from-[#7F56D9] to-[#B043F2] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? t("general.saving") : t("general.save")}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
