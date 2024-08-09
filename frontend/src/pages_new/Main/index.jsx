import React from "react";
import Sidebar from "@/components/Sidebar";
import DefaultChatContainer from "@/components/DefaultChat";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { isMobile } from "react-device-detect";
import { FullScreenLoader } from "@/components/Preloader";
import UserMenu from "@/components/UserMenu";

export default function Main() {
  const { loading, requiresAuth, mode } = usePasswordModal();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex my-[2px]">
      {!isMobile && <Sidebar />}
      <DefaultChatContainer />
    </div>
  );
}