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
    <div className="w-screen h-screen bg-primary flex">
      {/* Desktop sidebar - hidden on mobile */}
      {!isMobile && (
        <div className="flex-shrink-0 w-72 lg:w-80 xl:w-96">
          <Sidebar />
        </div>
      )}
      
      {/* Mobile header */}
      {isMobile && <SidebarMobileHeader />}
      
      {/* Functional menu positioned appropriately */}
      <div className={`absolute ${isMobile ? 'top-16 sm:top-18' : 'top-3 md:top-6'} right-4 md:right-10 z-50`}>
        <FunctionalMenu />
      </div>
      
      {/* Main content area with proper spacing */}
      <div className={`flex-1 ${isMobile ? 'pt-14 sm:pt-16' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
}
