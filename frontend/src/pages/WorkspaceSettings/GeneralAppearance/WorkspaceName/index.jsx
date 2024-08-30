import { useTranslation } from "react-i18next";

export default function WorkspaceName({ workspace, setHasChanges }) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex flex-col py-2">
        <label htmlFor="name" className="block input-label">
          {t("common.workspaces-name")}
        </label>
      </div>
      <input
        name="name"
        type="text"
        minLength={2}
        maxLength={36}
        defaultValue={workspace?.name}
        className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-fit p-2.5"
        placeholder="My Workspace"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}
