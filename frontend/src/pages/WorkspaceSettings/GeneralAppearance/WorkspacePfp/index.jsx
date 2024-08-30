import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { Plus } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function WorkspacePfp({ workspace, slug }) {
  const [pfp, setPfp] = useState(null);
  const { t } = useTranslation();
  useEffect(() => {
    async function fetchWorkspace() {
      const pfpUrl = await Workspace.fetchPfp(slug);
      setPfp(pfpUrl);
    }
    fetchWorkspace();
  }, [slug]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return false;

    const formData = new FormData();
    formData.append("file", file);
    const { success, error } = await Workspace.uploadPfp(
      formData,
      workspace.slug
    );
    if (!success) {
      showToast(`Failed to upload profile picture: ${error}`, "error");
      return;
    }

    const pfpUrl = await Workspace.fetchPfp(workspace.slug);
    setPfp(pfpUrl);
    showToast("Profile picture uploaded.", "success");
  };

  const handleRemovePfp = async () => {
    const { success, error } = await Workspace.removePfp(workspace.slug);
    if (!success) {
      showToast(`Failed to remove profile picture: ${error}`, "error");
      return;
    }

    setPfp(null);
  };

  return (
    <div>
      <div className="flex flex-col">
        <label className="block input-label">{t("general.pfp.title")}</label>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col items-center">
          <label className="w-28 h-28 flex flex-col items-center justify-center bg-zinc-900/50 transition-all duration-300 rounded-full mt-8 border-2 border-dashed border-white border-opacity-60 cursor-pointer hover:opacity-60">
            <input
              id="workspace-pfp-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            {pfp ? (
              <img
                src={pfp}
                alt="User profile picture"
                className="w-28 h-28 rounded-full object-cover bg-white"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-3">
                <Plus className="w-8 h-8 text-white/80 m-2" />
              </div>
            )}
          </label>
          {pfp && (
            <button
              type="button"
              onClick={handleRemovePfp}
              className="mt-3 text-white text-opacity-60 text-sm font-medium hover:underline"
            >
              {t("general.pfp.remove")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
