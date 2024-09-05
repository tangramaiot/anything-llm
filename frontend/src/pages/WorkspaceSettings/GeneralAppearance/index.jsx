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
    <>
        <form
          ref={formEl}
          onSubmit={handleUpdate}
          className="flex flex-col gap-y-6"
        >
          <WorkspacePfp workspace={workspace} slug={slug} />
          <WorkspaceName
            key={workspace.slug}
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
      {/* <SuggestedChatMessages slug={workspace.slug} /> */}
      {/* <DeleteWorkspace workspace={workspace} /> */}
    </>
  );
}
