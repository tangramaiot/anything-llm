import PreLoader from "@/components/Preloader";
import { dollarFormat } from "@/utils/numbers";
import WorkspaceFileRow from "./WorkspaceFileRow";
import { memo, useEffect, useState } from "react";
import ModalWrapper from "@/components/ModalWrapper";
import { Eye, PushPin } from "@phosphor-icons/react";
import { SEEN_DOC_PIN_ALERT, SEEN_WATCH_ALERT } from "@/utils/constants";
import paths from "@/utils/paths";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function WorkspaceDirectory({
  workspace,
  files,
  highlightWorkspace,
  loading,
  loadingMessage,
  setLoadingMessage,
  setLoading,
  fetchKeys,
  hasChanges,
  saveChanges,
  embeddingCosts,
  movedItems,
}) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="px-2 sm:px-4 lg:px-6 w-full h-full flex flex-col">
        <div className="flex items-center justify-start w-full mb-3">
          <h3 className="text-white text-sm lg:text-base font-bold truncate">
            {workspace.name}
          </h3>
        </div>
        <div className="relative w-full flex-1 bg-zinc-900 rounded-2xl overflow-hidden">
          <div className="text-white/80 text-xs grid grid-cols-12 py-2 px-4 lg:px-8 border-b border-white/20">
            <p className="col-span-5">Name</p>
            <p className="col-span-2" />
          </div>
          <div className="w-full h-full flex items-center justify-center flex-col gap-y-5 px-4">
            <PreLoader />
            <p className="text-white/80 text-xs lg:text-sm font-semibold animate-pulse text-center max-w-xs">
              {loadingMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col px-2 sm:px-4 lg:px-6 w-full h-full">
        <h3 className="text-white text-sm lg:text-base font-bold mb-3 truncate">
          {workspace.name}
        </h3>
        <div
          className={`relative w-full flex-1 bg-zinc-900 rounded-2xl border-4 transition-colors duration-200 flex flex-col overflow-hidden ${
            highlightWorkspace ? "border-cyan-300/80" : "border-transparent"
          }`}
        >
          <div className="text-white/80 text-xs grid grid-cols-12 py-2 px-4 lg:px-8 border-b border-white/20 bg-zinc-900 flex-shrink-0">
            <p className="col-span-5">{t("workspace-knowledge-management.table.column.name")}</p>
            <p className="col-span-2" />
          </div>
            {Object.values(files.items).some(
              (folder) => folder.items.length > 0
            ) || movedItems.length > 0 ? (
              <div className="flex-1 overflow-y-auto sidebar-scrollbar p-1">
                {files.items.map((folder) =>
                  folder.items.map((item, index) => (
                    <WorkspaceFileRow
                      key={index}
                      item={item}
                      folderName={folder.name}
                      workspace={workspace}
                      setLoading={setLoading}
                      setLoadingMessage={setLoadingMessage}
                      fetchKeys={fetchKeys}
                      hasChanges={hasChanges}
                      movedItems={movedItems}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center px-4">
                <p className="text-white text-opacity-40 text-xs lg:text-sm font-medium text-center">
                  {t("workspace-knowledge-management.table.noDocumentsFound")}
                </p>
              </div>
            )}
        </div>
        {hasChanges && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 gap-3 border-t border-white/10 mt-2">
            <div className="text-white/80 flex-1">
              <p className="text-xs lg:text-sm font-semibold">
                {embeddingCosts === 0
                  ? ""
                  : `Estimated Cost: ${
                      embeddingCosts < 0.01
                        ? `< $0.01`
                        : dollarFormat(embeddingCosts)
                    }`}
              </p>
              <p className="mt-1 text-xs italic" hidden={embeddingCosts === 0}>
                *One time cost for embeddings
              </p>
            </div>

            <button
              onClick={saveChanges}
              className="border border-slate-200 px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg text-white text-xs lg:text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800 transition-all duration-200 whitespace-nowrap flex-shrink-0"
            >
              Save and Embed
            </button>
          </div>
        )}
      </div>
      <PinAlert />
      <DocumentWatchAlert />
    </>
  );
}

const PinAlert = memo(() => {
  const [showAlert, setShowAlert] = useState(false);
  function dismissAlert() {
    setShowAlert(false);
    window.localStorage.setItem(SEEN_DOC_PIN_ALERT, "1");
    window.removeEventListener(handlePinEvent);
  }

  function handlePinEvent() {
    if (!!window?.localStorage?.getItem(SEEN_DOC_PIN_ALERT)) return;
    setShowAlert(true);
  }

  useEffect(() => {
    if (!window || !!window?.localStorage?.getItem(SEEN_DOC_PIN_ALERT)) return;
    window?.addEventListener("pinned_document", handlePinEvent);
  }, []);

  return (
    <ModalWrapper isOpen={showAlert} noPortal={true}>
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-main-gradient rounded-lg shadow">
          <div className="flex items-start justify-between p-4 rounded-t border-gray-500/50">
            <div className="flex items-center gap-2">
              <PushPin className="text-red-600 text-lg w-6 h-6" weight="fill" />
              <h3 className="text-xl font-semibold text-white">
                What is document pinning?
              </h3>
            </div>
          </div>
          <div className="w-full p-6 text-white text-md flex flex-col gap-y-2">
            <p>
              When you <b>pin</b> a document in AnythingLLM we will inject the
              entire content of the document into your prompt window for your
              LLM to fully comprehend.
            </p>
            <p>
              This works best with <b>large-context models</b> or small files
              that are critical to its knowledge-base.
            </p>
            <p>
              If you are not getting the answers you desire from AnythingLLM by
              default then pinning is a great way to get higher quality answers
              in a click.
            </p>
          </div>

          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
            <button disabled={true} className="invisible" />
            <button
              onClick={dismissAlert}
              className="border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              Okay, got it
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
});

const DocumentWatchAlert = memo(() => {
  const [showAlert, setShowAlert] = useState(false);
  function dismissAlert() {
    setShowAlert(false);
    window.localStorage.setItem(SEEN_WATCH_ALERT, "1");
    window.removeEventListener(handlePinEvent);
  }

  function handlePinEvent() {
    if (!!window?.localStorage?.getItem(SEEN_WATCH_ALERT)) return;
    setShowAlert(true);
  }

  useEffect(() => {
    if (!window || !!window?.localStorage?.getItem(SEEN_WATCH_ALERT)) return;
    window?.addEventListener("watch_document_for_changes", handlePinEvent);
  }, []);

  return (
    <ModalWrapper isOpen={showAlert} noPortal={true}>
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-main-gradient rounded-lg shadow">
          <div className="flex items-start justify-between p-4 rounded-t border-gray-500/50">
            <div className="flex items-center gap-2">
              <Eye
                className="text-yellow-600 text-lg w-6 h-6"
                weight="regular"
              />
              <h3 className="text-xl font-semibold text-white">
                What does watching a document do?
              </h3>
            </div>
          </div>
          <div className="w-full p-6 text-white text-md flex flex-col gap-y-2">
            <p>
              When you <b>watch</b> a document in AnythingLLM we will{" "}
              <i>automatically</i> sync your document content from it's original
              source on regular intervals. This will automatically update the
              content in every workspace where this file is managed.
            </p>
            <p>
              This feature currently supports online-based content and will not
              be available for manually uploaded documents.
            </p>
            <p>
              You can manage what documents are watched from the{" "}
              <Link
                to={paths.experimental.liveDocumentSync.manage()}
                className="text-blue-600 underline"
              >
                File manager
              </Link>{" "}
              admin view.
            </p>
          </div>

          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
            <button disabled={true} className="invisible" />
            <button
              onClick={dismissAlert}
              className="border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              Okay, got it
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
});

export default memo(WorkspaceDirectory);
