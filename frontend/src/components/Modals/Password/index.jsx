import React, { useState, useEffect } from "react";
import System from "../../../models/system";
import SingleUserAuth from "./SingleUserAuth";
import MultiUserAuth from "./MultiUserAuth";
import {
  AUTH_TOKEN,
  AUTH_USER,
  AUTH_TIMESTAMP,
} from "../../../utils/constants";
import useLogo from "../../../hooks/useLogo";
import illustration from "@/media/illustrations/login-illustration.png";

export default function PasswordModal({ mode = "single" }) {
  const { loginLogo } = useLogo();
  return (
    <div className="fixed  bg-[#25272C] top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] h-full bg-theme-bg-primary flex flex-col md:flex-row items-center justify-center">
      <div 
        className="min-h-screen flex flex-col md:flex-row items-center justify-center p-4 bg-chat-gradient">
        {/* Left section - Hidden on mobile, visible on md and up */}
        <div className="hidden md:flex md:flex-col md:w-1/2 md:max-w-2xl md:px-8 md:space-y-8">
          <h1 className="text-white text-2xl lg:text-4xl font-bold">
            Your best assistant, SAI-A.
          </h1>
          <div className="relative w-full aspect-square max-w-xl">
            <img
              src={illustration}
              alt="login illustration"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Right section - Login Form */}
        <div className="w-full md:w-1/2 max-w-lg">
          <div className="bg-transparent rounded-2xl border-2 border-purple-500/50 p-6 md:p-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img
                src={loginLogo}
                alt="Logo"
                className="h-12 md:h-16 w-auto"
              />
            </div>

            {/* Auth Component */}
            <div className="space-y-6">
              {mode === "single" ? <SingleUserAuth /> : <MultiUserAuth />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function usePasswordModal(notry = false) {
  const [auth, setAuth] = useState({
    loading: true,
    requiresAuth: false,
    mode: "single",
  });

  useEffect(() => {
    async function checkAuthReq() {
      if (!window) return;

      // If the last validity check is still valid
      // we can skip the loading.
      if (!System.needsAuthCheck() && notry === false) {
        setAuth({
          loading: false,
          requiresAuth: false,
          mode: "multi",
        });
        return;
      }

      const settings = await System.keys();
      if (settings?.MultiUserMode) {
        const currentToken = window.localStorage.getItem(AUTH_TOKEN);
        if (!!currentToken) {
          const valid = notry ? false : await System.checkAuth(currentToken);
          if (!valid) {
            setAuth({
              loading: false,
              requiresAuth: true,
              mode: "multi",
            });
            window.localStorage.removeItem(AUTH_USER);
            window.localStorage.removeItem(AUTH_TOKEN);
            window.localStorage.removeItem(AUTH_TIMESTAMP);
            return;
          } else {
            setAuth({
              loading: false,
              requiresAuth: false,
              mode: "multi",
            });
            return;
          }
        } else {
          setAuth({
            loading: false,
            requiresAuth: true,
            mode: "multi",
          });
          return;
        }
      } else {
        // Running token check in single user Auth mode.
        // If Single user Auth is disabled - skip check
        const requiresAuth = settings?.RequiresAuth || false;
        if (!requiresAuth) {
          setAuth({
            loading: false,
            requiresAuth: false,
            mode: "single",
          });
          return;
        }

        const currentToken = window.localStorage.getItem(AUTH_TOKEN);
        if (!!currentToken) {
          const valid = notry ? false : await System.checkAuth(currentToken);
          if (!valid) {
            setAuth({
              loading: false,
              requiresAuth: true,
              mode: "single",
            });
            window.localStorage.removeItem(AUTH_TOKEN);
            window.localStorage.removeItem(AUTH_USER);
            window.localStorage.removeItem(AUTH_TIMESTAMP);
            return;
          } else {
            setAuth({
              loading: false,
              requiresAuth: false,
              mode: "single",
            });
            return;
          }
        } else {
          setAuth({
            loading: false,
            requiresAuth: true,
            mode: "single",
          });
          return;
        }
      }
    }
    checkAuthReq();
  }, []);

  return auth;
}
