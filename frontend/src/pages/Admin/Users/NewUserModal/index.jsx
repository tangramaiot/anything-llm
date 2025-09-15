import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import { userFromStorage } from "@/utils/request";
import { RoleHintDisplay } from "..";

export default function NewUserModal({ closeModal, onSubmit }) {
  const [error, setError] = useState(null);
  const [role, setRole] = useState("default");
  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) data[key] = value;
    const { user, error } = await Admin.newUser(data);
    closeModal();
    onSubmit();
    setError(error);
  };

  const user = userFromStorage();

  return (
    <div className="relative w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] mx-auto">
      <div className="relative bg-main-gradient rounded-lg md:rounded-xl shadow-2xl border border-slate-300/20 overflow-hidden">
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-5 border-b border-gray-500/50 flex-shrink-0">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white truncate pr-4">
            Add user to instance
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="text-gray-300 w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        <form onSubmit={handleCreate} className="flex flex-col h-full">
          <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 flex-1 overflow-y-auto">
            <div className="w-full flex flex-col gap-y-3 md:gap-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  className="bg-zinc-900 placeholder:text-white/20 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors"
                  placeholder="User's username"
                  minLength={2}
                  required={true}
                  autoComplete="off"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  className="bg-zinc-900 placeholder:text-white/20 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors"
                  placeholder="User's initial password"
                  required={true}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Role
                </label>
                <select
                  name="role"
                  required={true}
                  defaultValue={"default"}
                  onChange={(e) => setRole(e.target.value)}
                  className="rounded-lg bg-zinc-900 px-3 md:px-4 py-2 md:py-2.5 text-sm text-white border border-gray-500 focus:ring-blue-500 focus:border-blue-500 w-full transition-colors"
                >
                  <option value="default">Default</option>
                  <option value="manager">Manager </option>
                  {user?.role === "admin" && (
                    <option value="admin">Administrator</option>
                  )}
                </select>
                <div className="mt-2">
                  <RoleHintDisplay role={role} />
                </div>
              </div>
              {error && <p className="text-red-400 text-sm bg-red-900/20 p-2 rounded-lg border border-red-500/20">Error: {error}</p>}
              <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/20">
                <p className="text-white/80 text-xs md:text-sm leading-relaxed">
                  After creating a user they will need to login with their initial
                  login to get access.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row w-full justify-end gap-2 sm:gap-3 p-3 sm:p-4 md:p-6 border-t border-gray-500/50 flex-shrink-0">
            <button
              onClick={closeModal}
              type="button"
              className="w-full sm:w-auto px-4 py-2 rounded-lg text-white hover:bg-stone-900 transition-all duration-300 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex justify-center gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800 order-1 sm:order-2"
            >
              Add user
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
