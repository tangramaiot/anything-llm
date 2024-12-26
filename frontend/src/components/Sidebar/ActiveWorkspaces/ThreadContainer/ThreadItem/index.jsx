import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import {
  ArrowCounterClockwise,
  DotsThree,
  PencilSimple,
  Trash,
  X,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import truncate from "truncate";

const THREAD_CALLOUT_DETAIL_WIDTH = 26;
export default function ThreadItem({
  idx,
  activeIdx,
  isActive,
  workspace,
  thread,
  onRemove,
  toggleMarkForDeletion,
  hasNext,
  ctrlPressed = false,
}) {
  const { slug } = useParams();
  const optionsContainer = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const linkTo = !thread.slug
    ? paths.workspace.chat(slug)
    : paths.workspace.thread(slug, thread.slug);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this thread? All of its chats will be deleted. You cannot undo this."
      )
    )
      return;
    const success = await Workspace.threads.delete(workspace.slug, thread.slug);
    if (!success) {
      showToast("Thread could not be deleted!", "error", { clear: true });
      return;
    }
    if (success) {
      showToast("Thread deleted successfully!", "success", { clear: true });
      onRemove(thread.id);
      navigate(paths.workspace.chat(slug));
      return;
    }
  };

  const triggerSidebarToggle = (isVisible) => {
    const event = new CustomEvent("toggleSidebar", {
      detail: { isVisible }
    });
    window.dispatchEvent(event);
  };

  return (
    <div
      className="w-full relative flex h-[38px] items-center border-none hover:bg-slate-600/20 rounded-lg"
      role="listitem"
    >
      {(
        <div
          style={{ width: THREAD_CALLOUT_DETAIL_WIDTH / 2 }}
          className={`border-l border-slate-300 h-[100%] absolute top-0 z-1 left-6`}
        ></div>
      )}

      {/* Curved line inline placeholder for spacing - not visible */}
      <div
        style={{ width: THREAD_CALLOUT_DETAIL_WIDTH + 8 }}
        className="h-full"
      />
      <div className="flex w-full items-center justify-between pr-2 group relative">
        {thread.deleted ? (
          <div className="w-full flex justify-between">
            <div className="w-full ">
              <p className={`px-3 text-base text-slate-400/50 italic`}>
                deleted thread
              </p>
            </div>
            {ctrlPressed && (
              <button
                type="button"
                className="border-none"
                onClick={() => toggleMarkForDeletion(thread.id)}
              >
                <ArrowCounterClockwise
                  className="text-zinc-300 hover:text-white"
                  size={18}
                />
              </button>
            )}
          </div>
        ) : (
          <a
            onClick={() => {
              if (window.location.pathname === linkTo || ctrlPressed) {
                navigate("#")
              } else { 
                navigate(linkTo)
              }
              triggerSidebarToggle(false);
            }}
            className="w-full"
            aria-current={isActive ? "page" : ""}
          >
            <p
              className={`px-3 text-base ${
                isActive ? "font-medium text-white" : "text-slate-400"
              }`}
            >
              {truncate(thread.name, 25)}
            </p>
          </a>
        )}
        {!!thread.slug && !thread.deleted && (
          <div ref={optionsContainer}>
            <div className="flex items-center w-fit gap-x-1">
              <button
                onClick={handleDelete}
                type="button"
                className="w-full rounded-md flex items-center p-2 gap-x-2 hover:bg-red-500/20 text-slate-300 hover:text-red-100"
              >
                <Trash size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
