import { useTranslation } from "react-i18next";
export default function ChatHistorySettings({ workspace, setHasChanges }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label htmlFor="openAiHistory" className="block text-sm font-medium text-white">
          {t("chat.history.title")}
        </label>
        <p className="text-white/70 text-xs md:text-sm leading-relaxed">
          {t("chat.history.desc-start")}
          <i className="text-blue-300"> {t("chat.history.recommend")} </i>
          {t("chat.history.desc-end")}
        </p>
      </div>
      <input
        name="openAiHistory"
        type="number"
        min={1}
        max={45}
        step={1}
        onWheel={(e) => e.target.blur()}
        defaultValue={workspace?.openAiHistory ?? 20}
        className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full max-w-xs p-2.5 border border-zinc-700 transition-colors"
        placeholder="20"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}
