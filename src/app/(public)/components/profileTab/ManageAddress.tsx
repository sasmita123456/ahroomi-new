"use client";

import { useState } from "react";
import { FiEdit, FiTrash2, FiPlus, FiMapPin, FiCheck, FiX } from "react-icons/fi";

// Define TypeScript interface for an Address
interface Address {
  id: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  isDefault?: boolean;
}

// Define TypeScript interface for the form data
interface AddressFormData {
  firstName: string;
  lastName: string;
  country: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
}

export default function ManageAddress() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      firstName: "Subhadra",
      lastName: "Patel",
      streetAddress: "Plot No. 45, Jaydev Vihar",
      city: "Bhubaneswar",
      state: "Odisha",
      zipCode: "751013",
      country: "India",
      phone: "+91 98765 43210",
      email: "subhadra.patel@example.com",
      isDefault: true,
    },
    {
      id: "2",
      firstName: "Rajesh",
      lastName: "Mishra",
      streetAddress: "Lane 7, Badambadi Colony",
      city: "Cuttack",
      state: "Odisha",
      zipCode: "753012",
      country: "India",
      phone: "+91 94370 12345",
      email: "rajesh.mishra@example.com",
    },
  
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<AddressFormData>({
    firstName: "",
    lastName: "",
    country: "India",
    streetAddress: "",
    city: "",
    state: "Odisha",
    zipCode: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingId ? { ...formData, id: editingId } : addr
        )
      );
      setEditingId(null);
    } else {
      setAddresses([
        ...addresses,
        { ...formData, id: Date.now().toString(), isDefault: false },
      ]);
    }
    setFormData({
      firstName: "",
      lastName: "",
      country: "India",
      streetAddress: "",
      city: "",
      state: "Odisha",
      zipCode: "",
      phone: "",
      email: "",
    });
    setShowForm(false);
  };

  const handleEdit = (address: Address) => {
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      country: address.country,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phone: address.phone,
      email: address.email,
    });
    setEditingId(address.id);
    setShowForm(true);
  };



  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      firstName: "",
      lastName: "",
      country: "India",
      streetAddress: "",
      city: "",
      state: "Odisha",
      zipCode: "",
      phone: "",
      email: "",
    });
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Manage Addresses
          </h2>
      
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="group cursor-pointer text-sm flex items-center gap-2 px-4 py-2.5 bg-[#f9c11c] text-gray-800 font-semibold rounded-lg shadow-md hover:bg-[#e3af15] transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Add New Address
          </button>
        )}
      </div>

      {/* Add/Edit Address Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-lg border border-[#c2e7f7] shadow-md mb-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#22a6dd] rounded-lg flex items-center justify-center">
                <FiPlus className="w-5 h-5 text-white" />
              </div>
              {editingId ? "Edit Address" : "Add New Address"}
            </h3>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleAddAddress} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  required
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
                  placeholder="Enter first name"
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
                  required
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
                  placeholder="Enter last name"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="streetAddress"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Street Address *
                </label>
                <input
                  type="text"
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
                  placeholder="House number, street name"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
                  placeholder="e.g., Bhubaneswar"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
                  placeholder="e.g., Odisha"
                />
              </div>

              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Zip Code *
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{6}"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
                  placeholder="6-digit PIN code"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
                  placeholder="India"
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
                  required
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
                  placeholder="+91 XXXXX XXXXX"
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
                  required
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="group cursor-pointer text-sm flex items-center gap-2 px-4 py-2.5 bg-[#f9c11c] text-gray-800 font-semibold rounded-lg shadow-md hover:bg-[#e3af15] transition-colors"
              >
                <FiCheck className="w-5 h-5" />
                {editingId ? "Update Address" : "Save Address"}
              </button>
          
            </div>
          </form>
        </div>
      )}

      {/* Existing Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="bg-white rounded-2xl border-2 border-gray-200 hover:border-[#22a6dd] transition-all duration-300 hover:shadow-xl overflow-hidden group"
          >
            {/* Address Header */}
            {address.isDefault && (
              <div className="bg-linear-to-r from-[#22a6dd] to-[#1e95c7] px-4 py-2">
                <div className="flex items-center gap-2 text-white text-sm font-semibold">
                  <FiCheck className="w-4 h-4" />
                  Default Address
                </div>
              </div>
            )}

            <div className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <FiMapPin className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {address.firstName} {address.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {address.email}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-gray-400 hover:text-[#22a6dd] hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit Address"
                  >
                    <FiEdit className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Address"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className=" mb-2">
                <p className="text-gray-700 leading-relaxed">
                  {address.streetAddress}
                </p>
                <p className="text-gray-700">
                  {address.city}, {address.state} - {address.zipCode}
                </p>
                <p className="text-gray-700">{address.country}</p>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-semibold">Phone:</span>
                  <span>{address.phone}</span>
                </div>
              </div>

              {!address.isDefault && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-sm text-[#4caf50] hover:text-[#1e95c7] font-semibold hover:underline transition-colors"
                  >
                    Set as Default
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {addresses.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMapPin className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No addresses saved
          </h3>
          <p className="text-gray-600 mb-6">
            Add your first address to get started
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#22a6dd] text-white font-semibold rounded-lg hover:bg-[#1e95c7] transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Add Address
          </button>
        </div>
      )}
    </div>
  );
}