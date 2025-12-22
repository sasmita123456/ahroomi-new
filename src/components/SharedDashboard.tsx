import Link from "next/link";
import {
  MdLocationOn,
  MdShoppingCart,
  MdPeople,
  MdAttachMoney,
  MdInventory,
  MdAssessment,
  MdCategory,
  MdArticle,
} from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import { BsBarChartLineFill } from "react-icons/bs";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

interface SharedDashboardProps {
  userRole: "ADMIN" | "CMS";
}

export default function SharedDashboard({ userRole }: SharedDashboardProps) {
  // Mock data - in a real app, this would come from an API
  const adminStats = [
    {
      title: "Total Categories",
      value: "6",
      icon: MdCategory,
      bgColor: "bg-[#C6EEEC]",
      iconColor: "text-teal-700",
      link: "/admin/category"
    },
    {
      title: "Total Orders ",
      value: "0",
      icon: MdShoppingCart,
      bgColor: "bg-[#FFF3A5]",
      iconColor: "text-yellow-700",
      link: "/admin/orders"
    },
    {
      title: "Total registered users ",
      value: "170",
      icon: MdPeople,
      bgColor: "bg-[#FFD9BD]",
      iconColor: "text-orange-700",
      link: "/admin/users"
    },
    {
      title: "Paid Users",
      value: "11",
      icon: FaUserCheck,
      bgColor: "bg-[#FFE6F5]",
      iconColor: "text-pink-700",
      link: "/admin/paid-users"
    },
    {
      title: "Sales",
      value: "0",
      icon: BsBarChartLineFill,
      bgColor: "bg-[#BED7F9]",
      iconColor: "text-blue-700",
      link: "/admin/sales"
    },
    {
      title: "Income",
      value: "0",
      icon: RiMoneyRupeeCircleFill,
      bgColor: "bg-[#FCD497]",
      iconColor: "text-amber-700",
      link: "/admin/income"
    },
    {
      title: "Total Products",
      value: "49",
      icon: MdInventory,
      bgColor: "bg-[#C5F1AA]",
      iconColor: "text-green-700",
      link: "/admin/product"
    },
    {
      title: " Avg Order Value ",
      value: "0",
      icon: MdAssessment,
      bgColor: "bg-[#ACDFFF]",
      iconColor: "text-cyan-700",
      link: "/admin/aov"
    },
  ];

  const cmsStats = [
    {
      title: "Articles",
      value: "24",
      description: "Published articles",
      icon: MdArticle,
      bgColor: "bg-[#C6EEEC]",
      iconColor: "text-teal-700",
      link: "/cms/articles"
    },
    {
      title: "Categories",
      value: "8",
      description: "Content categories",
      icon: MdCategory,
      bgColor: "bg-[#FFF3A5]",
      iconColor: "text-yellow-700",
      link: "/cms/categories"
    },
    {
      title: "Drafts",
      value: "3",
      description: "Unpublished content",
      icon: MdArticle,
      bgColor: "bg-[#FFD9BD]",
      iconColor: "text-orange-700",
      link: "/cms/drafts"
    },
    {
      title: "Views",
      value: "1,254",
      description: "Total page views",
      icon: MdPeople,
      bgColor: "bg-[#FFE6F5]",
      iconColor: "text-pink-700",
      link: "/cms/views"
    },
  ];

  const stats = userRole === "ADMIN" ? adminStats : cmsStats;

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-gray-800">
          {userRole === "ADMIN" ? "Admin Dashboard" : "CMS Dashboard"}
        </h2>
        <p className="text-gray-600 text-sm">
          Welcome to your {userRole === "ADMIN" ? "Admin" : "CMS"} Panel.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Link
              key={index}
              href={stat.link}
              className="block"
            >
              <div
                className={`${stat.bgColor} rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[15px] font-medium text-gray-700 mb-2">
                      {stat.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-800 mb-1">
                      {stat.value}
                    </p>
                  </div>

                  <IconComponent className={`text-2xl ${stat.iconColor}`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}