import { useEffect, useRef, useState } from "react";
import useLoginMode from "@/hooks/useLoginMode";
import useUser from "@/hooks/useUser";
import usePfp from "@/hooks/usePfp";
import { List, SignOut, UsersThree, Database } from "@phosphor-icons/react";
import { userFromStorage } from "@/utils/request";
import paths from "@/utils/paths";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import { useTranslation } from "react-i18next";
import Users from "../../pages/Admin/Users";

export default function FunctionalMenu() {
    
    const mode = useLoginMode();
    const { user } = useUser();
    const menuRef = useRef();
    const buttonRef = useRef();
    const [showMenu, setShowMenu] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
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
      <div className="flex w-full h-auto justify-end gap-1 sm:gap-2 px-1 sm:px-2 relative">
        <div>
          <button
            ref={buttonRef}
            onClick={() => setShowMenu(!showMenu)}
            type="button"
            className="transition-all duration-300 w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base font-semibold rounded-full flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient justify-center text-white p-1.5 sm:p-2 hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          >
            <List className="w-5 h-5 sm:w-6 sm:h-6" weight="bold" />
          </button>
        </div>
        
        <div className="transition-all duration-300 w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base font-semibold rounded-full flex items-center justify-center text-white p-1.5 sm:p-2 border-transparent border bg-gray-500/30">
          <UserDisplay />
        </div>
        
        {showMenu && (
          <div
            ref={menuRef}
            className="rounded-lg absolute top-12 sm:top-14 right-8 sm:right-12 justify-end bg-sidebar flex items-center bg-white shadow-lg"
          >
            <div className="flex flex-col gap-1 sm:gap-2 p-1.5 sm:p-2 min-w-[160px] sm:min-w-[200px]">
              {user?.role !== "default" && (
                <button
                  onClick={() => {
                    setShowUsers(!showUsers);
                  }}
                  type="button"
                  className="text-black hover:bg-slate-500/20 hover:text-purple-500 text-left py-1 sm:py-1.5 px-2 rounded-md flex gap-2 items-center text-sm sm:text-base"
                >
                  <UsersThree className="w-5 h-5 sm:w-6 sm:h-6" weight="bold" />
                  <span className="whitespace-nowrap">{t('settings.users')}</span>
                </button>
              )}
              
              <button
                onClick={() => {
                  window.localStorage.removeItem(AUTH_USER);
                  window.localStorage.removeItem(AUTH_TOKEN);
                  window.localStorage.removeItem(AUTH_TIMESTAMP);
                  window.location.replace(paths.home());
                }}
                type="button"
                className="text-black hover:bg-slate-500/20 hover:text-purple-500 text-left py-1 sm:py-1.5 px-2 rounded-md flex gap-2 items-center text-sm sm:text-base"
              >
                <SignOut className="w-5 h-5 sm:w-6 sm:h-6" weight="bold" />
                <span className="whitespace-nowrap">{t('logout')}</span>
              </button>
            </div>
          </div>
        )}
        
        {showUsers && user?.role !== "default" && (
          <Users closeUsers={() => setShowUsers(false)} />
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
