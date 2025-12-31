"use client";

import { useState } from "react";
import {
  FiUser,
  FiShoppingBag,
  FiMapPin,
  FiCreditCard,
  FiKey,
  FiLogOut,
} from "react-icons/fi";
import PersonalInfo from "../components/profileTab/PersonalInfo";
import MyOrder, { Order } from "../components/profileTab/MyOrder";
import ManageAddress from "./profileTab/ManageAddress";
import PaymentMethod from "./profileTab/PaymentMethod";
import PasswordManager from "./profileTab/PasswordManager";

// Define a type for the active tab
type TabType = "personal" | "orders" | "address" | "payment" | "password";

export default function ProfileTab() {
  const [activeTab, setActiveTab] = useState<TabType>("personal");

  // Dummy orders data
  const [orders] = useState<Order[]>([
    {
      id: "#SDGT1254FD",
      totalAmount: 640.0,
      paymentMethod: "Paypal",
      status: "Accepted",
      expectedDelivery: "April 24, 2024",
      items: [
        {
          id: "1",
          name: "Multi Power 500mg Apple Cider Vinegar Effervescent",
          color: "Red",
          quantity: 4,
          price: 160.0,
        },
      ],
    },
    {
      id: "#SDGT7412DF",
      totalAmount: 48.0,
      paymentMethod: "Cash",
      status: "Delivered",
      deliveryDate: "February 12, 2024",
      items: [
        {
          id: "2",
          name: "ACV Spark Boost",
          color: "Yellow",
          quantity: 1,
          price: 48.0,
        },
      ],
    },
  ]);

  const menuItems = [
    { id: "personal", label: "Personal Information", icon: FiUser },
    { id: "orders", label: "My Orders", icon: FiShoppingBag },
    { id: "address", label: "Manage Address", icon: FiMapPin },
    { id: "payment", label: "Payment Method", icon: FiCreditCard },
    { id: "password", label: "Password Manager", icon: FiKey },
  ];

  return (
    <section className="py-10 lg:py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* --- Left Sidebar --- */}
          <aside className="lg:col-span-1 sticky top-24 h-fit">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-[#eaeaea]">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as TabType)}
                      className={`w-full flex items-center text-sm space-x-3 px-4 py-2.5 rounded-md text-left transition-colors duration-200 shadow-sm ${
                        activeTab === item.id
                          ? "bg-[#22a6dd] text-white font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                <div className="pt-2 mt-4 border-t border-dashed border-gray-200">
                  <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-md text-left text-red-500 hover:bg-red-50 transition-colors duration-200">
                    <FiLogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* --- Right Content Area --- */}
          <main className="lg:col-span-3">
            <div className="bg-white p-4 lg:p-4 rounded-lg shadow-sm border border-[#eaeaea]">
              {/* Personal Information Content */}
              {activeTab === "personal" && <PersonalInfo />}

              {/* My Orders Content */}
              {activeTab === "orders" && <MyOrder orders={orders} />}

              {/* Placeholder for other tabs */}
              {activeTab === "address" && <ManageAddress />}
            {activeTab === "payment" && <PaymentMethod />}
              {activeTab === "password" && <PasswordManager />}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}