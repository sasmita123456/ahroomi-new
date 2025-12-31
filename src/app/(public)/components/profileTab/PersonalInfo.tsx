"use client";

import { useState } from "react";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import profileImg from "../../../../../public/assets/images/review3.png";

export default function PersonalInfo() {
  // Type for the form data
  type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
  };

  // Dummy data for the form
  const [formData, setFormData] = useState<FormData>({
    firstName: "Riya ",
    lastName: "Dey",
    email: "example@gmail.com",
    phone: "+0123 - 456 - 789",
    gender: "Female",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Personal Information
      </h2>

      {/* Avatar Section */}
      <div className="flex items-center mb-4">
        <div className="relative">
          <Image
            src={profileImg}
            alt="User Avatar"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
          <button className="absolute bottom-0 right-0 bg-[#22a6dd] text-white p-2 rounded-full shadow-md hover:bg-opacity-90 transition-colors">
            <FiEdit className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <form className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div className="pt-4">
          <button
            type="submit"
            className="group cursor-pointer text-sm flex items-center gap-2 px-4 py-2.5 bg-[#f9c11c] text-gray-800 font-semibold rounded-lg shadow-md hover:bg-[#e3af15] transition-colors"
          >
            Update Changes
          </button>
        </div>
      </form>
    </>
  );
}