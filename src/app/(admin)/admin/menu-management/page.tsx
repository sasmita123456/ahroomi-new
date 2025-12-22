"use client";

import Link from 'next/link';

export default function MenuManagementPage() {
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Menu Management</h2>
      </div>
      
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#BED7F9] border border-[#c5dcdc] rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <h2 className="text-base font-semibold mb-1 text-gray-800">Menu List</h2>
            <p className="text-gray-600 mb-4 text-sm">View and manage all menu items</p>
            <Link 
              href="/admin/menu-management/list"
              className="px-4 py-2 text-sm bg-white border border-[#056d6e] text-[#056d6e] rounded-full hover:bg-[#056d6e] hover:text-white transition-all duration-600"
            >
              View Menu List
            </Link>
          </div>
          
          <div className="bg-[#C6EEEC] border border-[#c5dcdc] rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <h2 className="text-base font-semibold mb-1 text-gray-800">Add New Menu</h2>
            <p className="text-gray-600 mb-4 text-sm">Create a new menu item</p>
            <Link 
              href="/admin/menu-management/new"
              className="px-4 py-2 text-sm bg-white border border-[#056d6e] text-[#056d6e] rounded-full hover:bg-[#056d6e] hover:text-white transition-all duration-600"
            >
              Add Menu Item
            </Link>
          </div>
          
          <div className="bg-[#FCD497] border border-[#c5dcdc] rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <h2 className="text-base font-semibold mb-1 text-gray-800">Menu Structure</h2>
            <p className="text-gray-600 mb-4 text-sm">Organize menu hierarchy</p>
            <Link 
              href="/admin/menu-management/list"
              className="px-4 py-2 text-sm bg-white border border-[#056d6e] text-[#056d6e] rounded-full hover:bg-[#056d6e] hover:text-white transition-all duration-600"
            >
              Organize Menus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}