import React, { lazy } from "react";
import DefaultChatContainer from "@/components/DefaultChat";
import Sidebar from "@/components/Sidebar";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { isMobile } from "react-device-detect";
import { FullScreenLoader } from "@/components/Preloader";
import FunctionalMenu from "@/components/FunctionalMenu";
import { FineTuningAlert } from "../FineTuning/Banner";
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
      {/* <div className="absolute top-3 right-4 md:top-9 md:right-10 w-fit h-fit z-99">
        <FunctionalMenu />
      </div> */}
      <div className="transition-all duration-500 md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] w-screen border-2 border-outline bg-chat-gradient">
        <Outlet />
      </div>
      <FineTuningAlert />
    </div>
  );
}
