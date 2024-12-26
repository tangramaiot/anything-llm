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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
      <div 
        className={`
          relative w-full max-w-4xl
          ${isMobile ? 'h-full' : 'h-[calc(100vh-32px)]'}
          mx-auto my-0 md:my-4
          overflow-y-auto
        `}
      >
        <div className="relative h-full bg-main-gradient rounded-xl shadow border-2 border-slate-300/10">
          {/* Close button */}
          <div className="absolute right-2 top-2 z-10">
            <button
              onClick={closeUsers}
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-300 bg-sidebar-button hover:bg-menu-item-selected-gradient rounded-lg border border-transparent hover:border-slate-100/50 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content container */}
          <div className="flex flex-col w-full h-full px-4 md:px-6 py-4 md:py-6">
            {/* Header */}
            <div className="w-full flex flex-col gap-y-1 pb-6 border-b-2 border-white/10">
              <div className="flex items-center gap-x-4">
                <p className="text-lg font-bold text-white">Users</p>
              </div>
              <p className="text-xs text-white">
                These are all the accounts which have an account on this instance.
                Removing an account will instantly remove their access to this instance.
              </p>
            </div>

            {/* Add user button */}
            <div className="w-full flex justify-end mt-3 mb-4">
              <CTAButton onClick={handleModalOpen}>
                <UserPlus className="h-6 w-6 mr-2" />
                Add user
              </CTAButton>
            </div>

            {/* Users list */}
            <div className="flex-1 overflow-x-auto">
              <UsersContainer refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>

        {/* Modal overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
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
    <table className="w-full text-sm text-left rounded-lg">
      <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60">
        <tr>
          <th scope="col" className="px-6 py-3 rounded-tl-lg">
            Username
          </th>
          <th scope="col" className="px-6 py-3">
            Role
          </th>
          <th scope="col" className="px-6 py-3">
            Date Added
          </th>
          <th scope="col" className="px-6 py-3 rounded-tr-lg">
            {" "}
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserRow key={user.id} currUser={currUser} user={user} onUserDeleted={handleUserDeleted} />
        ))}
      </tbody>
    </table>
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
    <div className="flex flex-col gap-y-1 py-1 pb-4">
      <p className="text-sm font-medium text-white">Permissions</p>
      <ul className="flex flex-col gap-y-1 list-disc px-4">
        {ROLE_HINT[role ?? "default"].map((hints, i) => {
          return (
            <li key={i} className="text-xs text-white/60">
              {hints}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
