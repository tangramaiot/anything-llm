import { useRef, useState } from "react";
import { titleCase } from "text-case";
import Admin from "@/models/admin";
import EditUserModal from "./EditUserModal";
import showToast from "@/utils/toast";
import { useModal } from "@/hooks/useModal";
import { createPortal } from 'react-dom';

const ModMap = {
  admin: ["admin", "manager", "default"],
  manager: ["manager", "default"],
  default: [],
};

export default function UserRow({ currUser, user, onUserDeleted }) {
  const rowRef = useRef(null);
  const canModify = ModMap[currUser?.role || "default"].includes(user.role);
  const [suspended, setSuspended] = useState(user.suspended === 1);
  const { isOpen, openModal, closeModal } = useModal();

  const handleSuspend = async () => {
    if (
      !window.confirm(
        `Are you sure you want to suspend ${user.username}?\nAfter you do this they will be logged out and unable to log back into this instance of AnythingLLM until unsuspended by an admin.`
      )
    )
      return false;

    const { success, error } = await Admin.updateUser(user.id, {
      suspended: suspended ? 0 : 1,
    });
    if (!success) showToast(error, "error", { clear: true });
    if (success) {
      showToast(
        `User ${!suspended ? "has been suspended" : "is no longer suspended"}.`,
        "success",
        { clear: true }
      );
      setSuspended(!suspended);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${user.username}?\nAfter you do this they will be logged out and unable to use this instance of AnythingLLM.\n\nThis action is irreversible.`
      )
    )
      return false;

    const { success, error } = await Admin.deleteUser(user.id);
    if (!success) {
      showToast(error, "error", { clear: true });
      return;
    }
    
    showToast("User deleted from system.", "success", { clear: true });
    onUserDeleted?.(user.id);
  };

  return (
    <>
      <tr
        ref={rowRef}
        className="bg-transparent text-white text-opacity-80 text-sm font-medium border-b border-white/5 hover:bg-white/5 transition-colors"
      >
        <th scope="row" className="px-2 sm:px-4 md:px-6 py-3 md:py-4 font-medium">
          <div className="truncate max-w-[120px] sm:max-w-[160px] md:max-w-none" title={user.username}>
            {user.username}
          </div>
        </th>
        <td className="px-2 sm:px-4 md:px-6 py-3 md:py-4">
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-300">
            {titleCase(user.role)}
          </span>
        </td>
        <td className="px-2 sm:px-4 md:px-6 py-3 md:py-4 hidden md:table-cell text-white/60 text-xs">
          {user.createdAt}
        </td>
        <td className="px-2 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3">
            {canModify && (
              <button
                onClick={openModal}
                className="text-xs sm:text-sm font-medium text-white/80 rounded-md hover:text-white px-2 py-1 hover:bg-white hover:bg-opacity-10 transition-colors whitespace-nowrap"
                title="Edit user"
              >
                Edit
              </button>
            )}
            {currUser?.id !== user.id && canModify && (
              <>
                <button
                  onClick={handleSuspend}
                  className="text-xs sm:text-sm font-medium text-white/80 hover:text-orange-300 rounded-md px-1 sm:px-2 py-1 hover:bg-orange-500 hover:bg-opacity-20 transition-colors whitespace-nowrap"
                  title={suspended ? "Unsuspend user" : "Suspend user"}
                >
                  <span className="hidden sm:inline">{suspended ? "Unsuspend" : "Suspend"}</span>
                  <span className="sm:hidden">{suspended ? "Un" : "Sus"}</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="text-xs sm:text-sm font-medium text-white/80 hover:text-red-300 px-1 sm:px-2 py-1 rounded-md hover:bg-red-800 hover:bg-opacity-20 transition-colors whitespace-nowrap"
                  title="Delete user"
                >
                  <span className="hidden sm:inline">Delete</span>
                  <span className="sm:hidden">Del</span>
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
      {isOpen && 
        createPortal(
          <div className="bg-black/60 backdrop-blur-sm fixed top-0 left-0 outline-none w-screen h-screen flex items-center justify-center z-99 p-4">
            <EditUserModal
              currentUser={currUser}
              user={user}
              closeModal={closeModal}
            />
          </div>,
          document.body
        )
      }
    </>
  );
}