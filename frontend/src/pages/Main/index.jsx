import React, { lazy } from "react";
import DefaultChatContainer from "@/components/DefaultChat";
import Sidebar, { SidebarMobileHeader} from "@/components/Sidebar";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { isMobile } from "react-device-detect";
import { FullScreenLoader } from "@/components/Preloader";
import FunctionalMenu from "@/components/FunctionalMenu";
import { Routes, Route, Outlet } from "react-router-dom";
const WorkspaceChat = lazy(() => import("@/pages/WorkspaceChat"));

export default function Main() {
  const { loading, requiresAuth, mode } = usePasswordModal();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-primary flex">
      {!isMobile && <Sidebar />} 
      <div className="absolute top-3 md:top-6 md:right-10 w-full z-99">
        <div className="relative flex items-center justify-between px-4 ">
          {isMobile && 
          <div className="flex-grow flex justify-start">
            <SidebarMobileHeader />
          </div>
          }
          <div className="flex-grow flex justify-end">
            <FunctionalMenu />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
