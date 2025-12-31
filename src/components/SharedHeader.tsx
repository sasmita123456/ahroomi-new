"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

import {
  FiMenu,
  FiBell,
  FiLogOut,
  FiChevronDown,
  FiSettings,
} from "react-icons/fi";

import { FaUserCircle } from "react-icons/fa";
import { MdInventory, MdPeopleAlt, MdMenu } from "react-icons/md";
import { FiSearch } from "react-icons/fi";

interface SharedHeaderProps {
  toggleSidebar: () => void;
  user?: any;
  userRole: "ADMIN" | "CMS" | "SUPER_ADMIN";
}

export default function SharedHeader({
  toggleSidebar,
  user,
  userRole,
}: SharedHeaderProps) {
  const router = useRouter();

  const [openProfile, setOpenProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  // Refs for dropdowns
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node) &&
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
        setOpenNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = "/login";
    } catch (error) {
      window.location.href = "/login";
    }
  };

  // Get profile link based on role
  const getProfileLink = () => {
    if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
      return "/admin/Profile";
    } else {
      return "/cms/profile";
    }
  };

  // Get settings link based on role
  const getSettingsLink = () => {
    if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
      return "/admin/settings";
    } else {
      return "/cms/settings";
    }
  };

  return (
    <header className="py-2.5 shadow-sm bg-white border-b border-gray-200
                 flex items-center px-6 justify-between
                 sticky top-0 z-[1000]">

      {/* LEFT SECTION - SEARCH BAR */}
      <div className="flex items-center flex-1">
        <div className="relative w-96 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-12 pr-4 py-2.5 text-gray-600 bg-[#F9FAFB] border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#04535c] focus:border-transparent transition-all duration-200 text-base "
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center justify-end gap-2">
        {/* NOTIFICATIONS */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setOpenNotifications(!openNotifications);
              setOpenProfile(false);
            }}
            className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
          >
            <FiBell className="h-5 w-5" />
            {/* Badge */}
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* NOTIFICATION DROPDOWN */}
          {openNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-[9998] animate-dropdown">
              <div className="px-5 py-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <p className="font-semibold text-gray-900">Notifications</p>
                <p className="text-xs text-gray-600 mt-1">You have 3 new notifications</p>
              </div>

              <ul className="divide-y divide-gray-100">
                <li className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 p-2 bg-blue-100 rounded-full">
                      <FiBell className="text-blue-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New notification</p>
                      <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                    </div>
                  </div>
                </li>

                <li className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 p-2 bg-yellow-100 rounded-full">
                      <MdInventory className="text-yellow-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">System update</p>
                      <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                    </div>
                  </div>
                </li>

                <li className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 p-2 bg-green-100 rounded-full">
                      <MdPeopleAlt className="text-green-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New message</p>
                      <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                    </div>
                  </div>
                </li>
              </ul>
              
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                <button className="text-xs font-medium text-blue-600 hover:text-blue-800">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PROFILE DROPDOWN */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setOpenProfile(!openProfile);
              setOpenNotifications(false);
            }}
            className="flex items-center gap-3 py-2 pl-2 pr-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            <div className="h-8 w-8 rounded-full bg-linear-to-br from-[#067a87] to-[#04535c] flex items-center justify-center text-white font-medium shadow-sm">
              {user?.name?.charAt(0) || (userRole === "ADMIN" ? "A" : "C")}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || (userRole === "ADMIN" ? "Admin" : userRole === "SUPER_ADMIN" ? "Super Admin" : "CMS User")}
              </p>
              {/* <p className="text-xs text-gray-500">
                {userRole === "ADMIN" ? "Administrator" : userRole === "SUPER_ADMIN" ? "Super Administrator" : "Content Manager"}
              </p> */}
            </div>
            <FiChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openProfile ? 'rotate-180' : ''}`} />
          </button>

          {/* PROFILE DROPDOWN */}
          {openProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-[10000] animate-dropdown">
              <div className="px-5 py-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <p className="font-semibold text-gray-900">Account</p>
                <p className="text-sm text-gray-600 mt-1 truncate">
                  {user?.email || "user@example.com"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Role: {userRole === "ADMIN" ? "Administrator" : userRole === "SUPER_ADMIN" ? "Super Administrator" : "Content Manager"}
                </p>
                
                
              </div>

              <ul className="py-2">
                {/* Profile Update - Only for SUPER_ADMIN */}
                {userRole === 'SUPER_ADMIN' && (
                  <li>
                    <button
                      onClick={() => router.push(getProfileLink())}
                      className="w-full text-left px-5 py-3 hover:bg-gray-50 flex gap-3 items-center transition-colors duration-150"
                    >
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUserCircle className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Profile</p>
                        <p className="text-xs text-gray-500">Update your information</p>
                      </div>
                    </button>
                  </li>
                )}

                {/* Settings - Only for SUPER_ADMIN */}
                {userRole === 'SUPER_ADMIN' && (
                  <li>
                    <button
                      onClick={() => router.push(getSettingsLink())}
                      className="w-full text-left px-5 py-3 hover:bg-gray-50 flex gap-3 items-center transition-colors duration-150"
                    >
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <FiSettings className="text-gray-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Settings</p>
                        <p className="text-xs text-gray-500">Manage your preferences</p>
                      </div>
                    </button>
                  </li>
                )}

                {/* User Management - Only for SUPER_ADMIN */}
                {userRole === 'SUPER_ADMIN' && (
                  <li>
                    <button
                      onClick={() => router.push('/admin/users/list')}
                      className="w-full text-left px-5 py-3 hover:bg-gray-50 flex gap-3 items-center transition-colors duration-150"
                    >
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <MdPeopleAlt className="text-purple-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">User Management</p>
                        <p className="text-xs text-gray-500">Manage all users</p>
                      </div>
                    </button>
                  </li>
                )}

                {/* Menu Management - Only for SUPER_ADMIN */}
                {userRole === 'SUPER_ADMIN' && (
                  <li>
                    <button
                      onClick={() => router.push('/admin/menu-management/list')}
                      className="w-full text-left px-5 py-3 hover:bg-gray-50 flex gap-3 items-center transition-colors duration-150"
                    >
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <MdMenu className="text-green-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Menu Management</p>
                        <p className="text-xs text-gray-500">Manage system menus</p>
                      </div>
                    </button>
                  </li>
                )}

                {/* Logout - Available to all users */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 hover:bg-red-50 flex gap-3 items-center transition-colors duration-150 border-t border-gray-100 mt-2"
                  >
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <FiLogOut className="text-red-600 text-sm" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-600">Logout</p>
                      <p className="text-xs text-gray-500">Sign out of your account</p>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}