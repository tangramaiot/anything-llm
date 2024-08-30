import { useTranslation } from "react-i18next";
export default function ChatTemperatureSettings({
  workspace,
  setHasChanges,
}) {
  const defaults = { temp: 0.7 };
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          {t("chat.temperature.title")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {t("chat.temperature.desc-start")}
          <br />
          {t("chat.temperature.desc-end")}
          <br />
          <br />
        </p>
      </div>
      <input
        name="openAiTemp"
        type="number"
        min={0.0}
        step={0.1}
        onWheel={(e) => e.target.blur()}
        defaultValue={workspace?.openAiTemp ?? defaults.temp}
        className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        placeholder="0.7"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}
