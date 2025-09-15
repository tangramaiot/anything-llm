import { useEffect, useState, useCallback  } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { UserPlus, X } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import UserRow from "./UserRow";
import useUser from "@/hooks/useUser";
import NewUserModal from "./NewUserModal";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import CTAButton from "@/components/lib/CTAButton";

export default function AdminUsers( { closeUsers }) {
  const [isOpen, setIsOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // Function to trigger refresh
  const refreshUsers = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleModalOpen = useCallback(() => {
    setIsOpen(true);
  }, [])
  
  // Create a wrapped NewUserModal that handles successful submission
  const WrappedNewUserModal = ({ closeModal }) => {
    const handleSubmit = async (formData) => {
      try {
        // After successful submission
        refreshUsers();
        closeModal();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };

    return (
      <NewUserModal 
        closeModal={closeModal}
        onSubmit={handleSubmit}
      />
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 p-2 sm:p-4">
      <div 
        className={`
          relative w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl
          ${isMobile ? 'h-[95vh]' : 'h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)]'}
          mx-auto
          overflow-hidden
          flex flex-col
        `}
      >
        <div className="relative h-full bg-main-gradient rounded-lg md:rounded-xl shadow-2xl border border-slate-300/20 flex flex-col">
          {/* Close button */}
          <div className="absolute right-2 sm:right-3 md:right-4 top-2 sm:top-3 md:top-4 z-10">
            <button
              onClick={closeUsers}
              type="button"
              className="p-1.5 md:p-2 text-gray-400 hover:text-gray-300 bg-sidebar-button hover:bg-menu-item-selected-gradient rounded-lg border border-transparent hover:border-slate-100/50 transition-all duration-300"
              aria-label="Close users panel"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Content container */}
          <div className="flex flex-col w-full h-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 overflow-hidden">
            {/* Header */}
            <div className="w-full flex flex-col gap-y-1 pb-4 md:pb-6 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-x-2 md:gap-x-4 pr-8 md:pr-12">
                <p className="text-base md:text-lg font-bold text-white truncate">Users</p>
              </div>
              <p className="text-xs md:text-sm text-white/80 leading-relaxed">
                These are all the accounts which have an account on this instance.
                Removing an account will instantly remove their access to this instance.
              </p>
            </div>

            {/* Add user button */}
            <div className="w-full flex justify-end mt-3 md:mt-4 mb-3 md:mb-4 flex-shrink-0">
              <CTAButton onClick={handleModalOpen} className="text-sm md:text-base">
                <UserPlus className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Add user</span>
                <span className="sm:hidden">Add</span>
              </CTAButton>
            </div>

            {/* Users list */}
            <div className="flex-1 overflow-hidden">
              <UsersContainer refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>

        {/* Modal overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <WrappedNewUserModal closeModal={handleModalClose} />
          </div>
        )}
      </div>
    </div>
  );
}

function UsersContainer({ refreshTrigger }) {
  const { user: currUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const _users = await Admin.users();
      setUsers(_users);
      setLoading(false);
    }
    fetchUsers();
  }, [refreshTrigger]);
  
  const handleUserDeleted = (userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };
  
  if (loading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        highlightColor="#3D4147"
        baseColor="#2C2F35"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <div className="w-full h-full overflow-auto">
      <table className="w-full text-sm text-left rounded-lg min-w-[600px]">
        <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60 sticky top-0 bg-main-gradient z-10">
          <tr>
            <th scope="col" className="px-2 sm:px-4 md:px-6 py-3 rounded-tl-lg">
              Username
            </th>
            <th scope="col" className="px-2 sm:px-4 md:px-6 py-3">
              Role
            </th>
            <th scope="col" className="px-2 sm:px-4 md:px-6 py-3 hidden md:table-cell">
              Date Added
            </th>
            <th scope="col" className="px-2 sm:px-4 md:px-6 py-3 rounded-tr-lg text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <UserRow key={user.id} currUser={currUser} user={user} onUserDeleted={handleUserDeleted} />
            ))
          ) : (
            <tr>
              <td className="text-center py-8 text-white/60" colSpan="4">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const ROLE_HINT = {
  default: [
    "Can only send chats with workspaces they are added to by admin or managers.",
    "Cannot modify any settings at all.",
  ],
  manager: [
    "Can view, create, and delete any workspaces and modify workspace-specific settings.",
    "Can create, update and invite new users to the instance.",
    "Cannot modify LLM, vectorDB, embedding, or other connections.",
  ],
  admin: [
    "Highest user level privilege.",
    "Can see and do everything across the system.",
  ],
};

export function RoleHintDisplay({ role }) {
  return (
    <div className="flex flex-col gap-y-1 py-2 px-3 bg-gray-800/30 rounded-lg border border-gray-600/30">
      <p className="text-xs md:text-sm font-medium text-white/90">Permissions</p>
      <ul className="flex flex-col gap-y-1 list-disc pl-4 space-y-0.5">
        {ROLE_HINT[role ?? "default"].map((hints, i) => {
          return (
            <li key={i} className="text-xs text-white/70 leading-relaxed">
              {hints}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
