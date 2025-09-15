import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import Admin from "@/models/admin";
import { useEffect, useState } from "react";
import * as Skeleton from "react-loading-skeleton";
import AddMemberModal from "./AddMemberModal";
import WorkspaceMemberRow from "./WorkspaceMemberRow";
import CTAButton from "@/components/lib/CTAButton";

export default function Members({ workspace }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [workspaceUsers, setWorkspaceUsers] = useState([]);
  const [adminWorkspace, setAdminWorkspace] = useState(null);

  const { isOpen, openModal, closeModal } = useModal();
  useEffect(() => {
    async function fetchData() {
      const _users = await Admin.users();
      const workspaceUsers = await Admin.workspaceUsers(workspace.id);
      const adminWorkspaces = await Admin.workspaces();
      setAdminWorkspace(
        adminWorkspaces.find(
          (adminWorkspace) => adminWorkspace.id === workspace.id
        )
      );
      setWorkspaceUsers(workspaceUsers);
      setUsers(_users);
      setLoading(false);
    }
    fetchData();
  }, [workspace, isOpen]);

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
    <div className="h-full flex flex-col">
      {/* Header with action button */}
      <div className="flex-shrink-0 pb-4 md:pb-6">
        <div className="flex justify-end">
          <CTAButton onClick={openModal} className="w-full sm:w-auto">
            Manage Users
          </CTAButton>
        </div>
      </div>
      
      {/* Scrollable table container */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="h-full overflow-y-auto pr-4 -mr-4">
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-sm text-left rounded-lg min-w-[600px]">
              <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60 sticky top-0 bg-main-gradient z-10">
                <tr>
                  <th scope="col" className="px-3 md:px-6 py-3 rounded-tl-lg">
                    Username
                  </th>
                  <th scope="col" className="px-3 md:px-6 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-3 md:px-6 py-3 hidden sm:table-cell">
                    Date Added
                  </th>
                  <th scope="col" className="px-3 md:px-6 py-3 rounded-tr-lg text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {workspaceUsers.length > 0 ? (
                  workspaceUsers.map((user, index) => (
                    <WorkspaceMemberRow key={index} user={user} />
                  ))
                ) : (
                  <tr>
                    <td className="text-center py-8 text-white/60" colSpan="4">
                      No workspace members
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal */}
      { isOpen && (
        <div className="bg-black/60 backdrop-blur-sm fixed top-0 left-0 outline-none w-screen h-screen flex items-center justify-center z-30 p-4">
          <AddMemberModal
            closeModal={closeModal}
            users={users}
            workspace={adminWorkspace}
          />
        </div>
      )}
    </div>
  );
}
