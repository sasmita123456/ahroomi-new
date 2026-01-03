"use client";

import { FC, useEffect, useState, useContext } from "react";
import {
  MdDashboard,
  MdCategory,
  MdOutlinePriceChange,
  MdInventory,
  MdCampaign,
  MdReport,
  MdInput,
  MdPeopleAlt,
  MdLocalShipping,
  MdPayment,
  MdSettings,
  MdShoppingCart,
  MdAssessment,
  MdReviews,
  MdLocationOn,
  MdInfo,
  MdImage,
  MdCollections,
  MdBusiness,
  MdMenu,
  MdExpandMore,
  MdExpandLess
} from "react-icons/md";
import { FaBoxes, FaPalette, FaTags, FaPercent } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { menuService, MenuItem } from "@/services/menu.service";
import { useMenuContext } from "@/contexts/MenuContext";
import blackLogo from "../../public/assets/images/blackLogo.png";

interface SharedSidebarProps {
  isOpen: boolean;
  toggle: () => void;
  userRole: 'ADMIN' | 'CMS' | 'SUPER_ADMIN';
}

// Map icon names to actual components
const iconMap: Record<string, React.ElementType> = {
  MdDashboard,
  MdCategory,
  MdOutlinePriceChange,
  MdInventory,
  MdCampaign,
  MdReport,
  MdInput,
  MdPeopleAlt,
  MdLocalShipping,
  MdPayment,
  MdSettings,
  MdShoppingCart,
  MdAssessment,
  MdReviews,
  MdLocationOn,
  MdInfo,
  MdImage,
  MdCollections,
  MdBusiness,
  MdMenu,
  FaBoxes,
  FaPalette,
  FaTags,
  FaPercent
};

const SharedSidebar: FC<SharedSidebarProps> = ({ isOpen, toggle, userRole }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { menus, fetchMenus } = useMenuContext();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Fetch menu items based on user role
  useEffect(() => {
    fetchMenus(userRole);
  }, [userRole, fetchMenus]);

  // Update expanded items when menus change
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    (menus[userRole] || []).forEach(item => {
      if (item.children && item.children.length > 0) {
        // Expand by default if current path is under this menu item
        initialExpanded[item._id] = isPathUnderMenu(item, pathname);
      }
    });
    setExpandedItems(initialExpanded);
  }, [menus, userRole, pathname]);

  // Check if current path is under a menu item or its children
  const isPathUnderMenu = (menu: MenuItem, currentPath: string): boolean => {
    // Check if current path matches this menu item
    if (currentPath === menu.link) {
      return true;
    }
    
    // Check if current path matches any child menu items
    if (menu.children && menu.children.length > 0) {
      return menu.children.some(child => isPathUnderMenu(child, currentPath));
    }
    
    return false;
  };

  // Toggle expanded state for a menu item
  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Handle submenu click - navigate to parent menu if it has a link
  const handleSubmenuClick = (parentMenu: MenuItem, submenu: MenuItem) => {
    // If parent menu has a link, navigate to it
    if (parentMenu.link && parentMenu.link !== '#') {
      router.push(parentMenu.link);
    } else {
      // Otherwise, just expand the parent menu
      setExpandedItems(prev => ({
        ...prev,
        [parentMenu._id]: true
      }));
    }
  };

  // Get static menu items as fallback
  const getStaticMenuItems = (role: 'ADMIN' | 'CMS' | 'SUPER_ADMIN'): MenuItem[] => {
    if (role === 'ADMIN') {
      return [
        {
          _id: 'dashboard',
          name: 'Dashboard',
          link: '/admin/dashboard',
          icon: 'MdDashboard',
          parentId: null,
          order: 1,
          isActive: true,
          roles: ['ADMIN'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    } else if (role === 'SUPER_ADMIN') {
      return [
        {
          _id: 'dashboard',
          name: 'Dashboard',
          link: '/admin/dashboard',
          icon: 'MdDashboard',
          parentId: null,
          order: 1,
          isActive: true,
          roles: ['SUPER_ADMIN'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'user-management',
          name: 'User Management',
          link: '/admin/users/list',
          icon: 'MdPeopleAlt',
          parentId: null,
          order: 2,
          isActive: true,
          roles: ['SUPER_ADMIN'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'menu-management',
          name: 'Menu Management',
          link: '/admin/menu-management/list',
          icon: 'MdMenu',
          parentId: null,
          order: 3,
          isActive: true,
          roles: ['SUPER_ADMIN'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    } else {
      return [
        {
          _id: 'dashboard',
          name: 'Dashboard',
          link: '/cms/dashboard',
          icon: 'MdDashboard',
          parentId: null,
          order: 1,
          isActive: true,
          roles: ['CMS'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  };

  // Render a single menu item
  const renderMenuItem = (item: MenuItem) => {
    const isActive = isPathUnderMenu(item, pathname);
    const IconComponent = item.icon && iconMap[item.icon] ? iconMap[item.icon] : MdCategory;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item._id];

    return (
      <div key={item._id}>
        {hasChildren ? (
          // Menu item with children (dropdown)
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer
              ${isActive
                ? "bg-[#CAF8E4]"
                : "hover:bg-[#3EA296]/20"
              }
            `}
            onClick={() => toggleExpand(item._id)}
          >
            {/* ICON */}
            <IconComponent
              className={`text-lg transition-colors duration-200 ${
                isActive ? "text-[#056D6E]" : "text-white"
              }`}
            />

            {/* NAME */}
            {isOpen && (
              <span
                className={`font-medium grow text-sm ${
                  isActive ? "text-[#056D6E] font-semibold" : "text-white"
                }`}
              >
                {item.name}
              </span>
            )}

            {/* EXPAND/COLLAPSE ICON */}
            {isOpen && hasChildren && (
              <span className={isActive ? "text-[#056D6E]" : "text-white"}>
                {isExpanded ? (
                  <MdExpandLess />
                ) : (
                  <MdExpandMore />
                )}
              </span>
            )}
          </div>
        ) : (
          // Menu item without children (direct link)
          <Link
            href={item.link}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
              ${isActive
                ? "bg-[#CAF8E4]"
                : "hover:bg-[#3EA296]/20"
              }
            `}
          >
            {/* ICON */}
            <IconComponent
              className={`text-lg transition-colors duration-200 ${
                isActive ? "text-[#056D6E]" : "text-white"
              }`}
            />

            {/* NAME */}
            {isOpen && (
              <span
                className={`font-medium grow text-sm ${
                  isActive ? "text-[#056D6E] font-semibold" : "text-white"
                }`}
              >
                {item.name}
              </span>
            )}
          </Link>
        )}

        {/* SUBMENU ITEMS WITH STRAIGHT LINE DESIGN */}
        {isOpen && hasChildren && isExpanded && (
          <div className="relative">
            {/* Vertical line connecting to parent */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#4ABBA5] opacity-60"></div>
            
            {/* Submenu items */}
            <div className="ml-7 mt-1 space-y-1">
              {item.children!.map((subItem, index) => {
                const isSubActive = pathname === subItem.link;
                const isLastItem = index === item.children!.length - 1;
                
                return (
                  <div key={subItem._id} className="relative">
                    {/* Horizontal line connecting to submenu item */}
                    
                    {/* Submenu item */}
                    <Link
                      href={subItem.link}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                        isSubActive
                          ? "text-[#d9d86c] font-semibold"
                          : "text-white hover:bg-[#3EA296]/20"
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-current opacity-60"></span>
                      <span className="text-sm">{subItem.name}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`h-full shadow-xl border-r transition-all duration-300 flex flex-col
        ${isOpen ? "w-64" : "w-20"}
      `}
      style={{ backgroundColor: "#04535C" }}
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-center px-4 py-2 relative border-b border-[#2f676e]"
      >
        <div className="flex items-center">
          {isOpen ? (
            <Image 
              src={blackLogo} 
              alt="Ahroomi Logo" 
              width={120} 
              height={40}
                priority
                loading="eager"
              className="object-contain invert"
            />
          ) : (
            <Image 
              src={blackLogo} 
              alt="Ahroomi Logo" 
              width={32} 
              height={32}
                priority
                loading="eager"
              className="object-contain invert"
            />
          )}
        </div>

        <button onClick={toggle} className="h-8 w-8 text-xl absolute -right-3 shadow-lg flex items-center justify-center rounded-full bg-white text-[#524f4f] z-1">
          {isOpen ? <FiChevronLeft className="rounded-full border border-[#524f4f]"/> : <FiChevronRight className="rounded-full border border-[#524f4f]"/>}
        </button>
      </div>

      {/* MENU LIST */}
      <nav className="py-3 px-4 overflow-y-auto h-[calc(100%-4rem)] space-y-1 hide-scrollbar">
        {(menus[userRole] || []).map(renderMenuItem)}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto p-4 text-center text-xs text-white/70">
        {isOpen && `© 2025 ${userRole === 'ADMIN' ? "Admin" : "CMS"} Panel`}
      </div>
    </aside>
  );
};

export default SharedSidebar;