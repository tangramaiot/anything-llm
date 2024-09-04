import { useEffect, useRef, useState } from "react";
import useLoginMode from "@/hooks/useLoginMode";
import useUser from "@/hooks/useUser";
import usePfp from "@/hooks/usePfp";
import { List, SignOut, UsersThree, Database } from "@phosphor-icons/react";
import { userFromStorage } from "@/utils/request";
import paths from "@/utils/paths";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import { useTranslation } from "react-i18next";

export default function FunctionalMenu() {
    
    const mode = useLoginMode();
    const { user } = useUser();
    const menuRef = useRef();
    const buttonRef = useRef();
    const [showMenu, setShowMenu] = useState(false);
    const {t} = useTranslation();
    
    const handleOpenAccountModal = () => {
      setShowAccountSettings(true);
      setShowMenu(false);
    };

    const handleClose = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    useEffect(() => {
      if (showMenu) {
        document.addEventListener("mousedown", handleClose);
      }
      return () => document.removeEventListener("mousedown", handleClose);
    }, [showMenu]);
    
    return (
        <div className="flex w-full h-auto mx-2 justify-end gap-2">
          <div>
            <button
                ref={buttonRef}
                onClick={() => setShowMenu(!showMenu)}
                type="button"
                className="transition-all duration-300 w-[48px] h-[48px] text-base font-semibold rounded-full flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient justify-center text-white p-2 hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            >
                <List className="w-6 h-6" weight="bold" />
            </button>
          </div>
          <div>
            <button
                ref={buttonRef}
                type="button"
                className="transition-all duration-300 w-[48px] h-[48px] text-base font-semibold rounded-full flex items-center bg-sidebar-button justify-center text-white p-2 border-transparent border"
            >
                <UserDisplay />
            </button>
          </div>
          {showMenu && (
            <div
              ref={menuRef}
              className="rounded-lg absolute top-14 right-12 justify-end bg-sidebar flex items-center-justify-center bg-white"
            >
              <div className="flex flex-col gap-2 p-2">
                <button
                    onClick={() => {
                    }}
                    type="button"
                    className="text-black hover:bg-slate-500/20 hover:text-purple-500 text-left py-1.5 rounded-md flex gap-2"
                  >
                    <UsersThree className="w-6 h-6" weight="bold" />
                    {t('settings.users')}
                </button>
                <button
                    onClick={() => {
                    }}
                    type="button"
                    className="text-black hover:bg-slate-500/20 hover:text-purple-500 text-left py-1.5 rounded-md flex gap-2"
                  >
                    <Database className="w-6 h-6" weight="bold" />
                    {t('workspace-knowledge-management.sharedKnowledge')}
                </button>
                <button
                  onClick={() => {
                    window.localStorage.removeItem(AUTH_USER);
                    window.localStorage.removeItem(AUTH_TOKEN);
                    window.localStorage.removeItem(AUTH_TIMESTAMP);
                    window.location.replace(paths.home());
                  }}
                  type="button"
                  className="text-black hover:bg-slate-500/20 hover:text-purple-500 text-left py-1.5 rounded-md flex gap-2"
                >
                  <SignOut className="w-6 h-6" weight="bold" />
                  {t('logout')}
                </button>
              </div>
            </div>
          )}
        </div>
    );
}

function UserDisplay() {
  const { pfp } = usePfp();
  const user = userFromStorage();

  if (pfp) {
    return (
      <div className="w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden transition-all duration-300 bg-gray-100 hover:border-slate-100 hover:border-opacity-50 border-transparent border hover:opacity-60">
        <img
          src={pfp}
          alt="User profile picture"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return user?.username?.slice(0, 1) || "AA";
}
