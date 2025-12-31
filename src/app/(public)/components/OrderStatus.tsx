"use client";
import { useState } from "react";
import track1 from "../../../../public/assets/images/track1.png";
import track2 from "../../../../public/assets/images/track2.png";
import track3 from "../../../../public/assets/images/track3.png";
import track4 from "../../../../public/assets/images/track4.png";
import track5 from "../../../../public/assets/images/track5.png";
import plix1 from "../../../../public/assets/images/plix1.png";
import plix3 from "../../../../public/assets/images/plix3.png";
import plix4 from "../../../../public/assets/images/plix4.jpg";
import plix6 from "../../../../public/assets/images/plix6.jpg";
import Image from "next/image";

// --- TypeScript Interface for the new Product List ---
interface Product {
  id: number;
  name: string;
  color: string;
  quantity: number;
  image: any; // Using 'any' for image imports, but you could be more specific if needed
}

// --- Typed Product Data ---
const orderProducts: Product[] = [
  {
    id: 1,
    name: "Multi Power 500mg Apple Cider Vinegar Effervescen",
    color: "Red",
    quantity: 2,
    image: plix1,
  },
  {
    id: 2,
    name: "Multi Power 500mg Apple Cider Vinegar Effervescent",
    color: "Green",
    quantity: 1,
    image: plix3,
  },
  {
    id: 3,
    name: "Ultra Vitality for Enhanced Strength, Endurance & Performance",
    color: "Purple",
    quantity: 3,
    image: plix4,
  },
    {
    id: 4,
    name: "Jamun Mattifying Lightweight Sunscreen With SPF50+ PA+++",
    color: "Purple",
    quantity: 2,
    image: plix6,
  },
];


export default function OrderStatus() {
  const [activeStep, setActiveStep] = useState(2); // TypeScript infers type as number

  const orderSteps = [
    {
      id: 1,
      name: "Order Placed",
      date: "20 Apr 2024",
      time: "11:00 AM",
      status: "completed" as const, // 'as const' for literal type inference
      icon: track1,
      description: "Your order has been received",
    },
    {
      id: 2,
      name: "Accepted",
      date: "20 Apr 2024",
      time: "11:15 AM",
      status: "completed" as const,
      icon: track2,
      description: "Your order has been confirmed",
    },
    {
      id: 3,
      name: "In Progress",
      date: "21 Apr 2024",
      time: "",
      status: "current" as const,
      icon: track3,
      description: "Your order is being prepared",
    },
    {
      id: 4,
      name: "On the Way",
      date: "22-23 Apr 2024",
      time: "",
      status: "upcoming" as const,
      icon: track4,
      description: "Your order is out for delivery",
    },
    {
      id: 5,
      name: "Delivered",
      date: "24 Apr 2024",
      time: "",
      status: "upcoming" as const,
      icon: track5,
      description: "Your order has been delivered",
    },
  ];

  const progressPercentage = ((activeStep - 1) / (orderSteps.length - 1)) * 100;

  return (
    <>
      <div className="track_order py-10">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Order Status</h2>
            <p className="text-gray-600 text-sm">
              Order ID: <span className="font-semibold text-indigo-600">#SDGT1254FD</span>
            </p>
          </div>

          {/* Timeline Container - Desktop: Horizontal, Mobile: Vertical */}
          <div className="bg-white rounded-lg p-6 sm:p-4 border border-[#d4d4d4]">
            {/* Mobile: Vertical Timeline */}
            <div className="block md:hidden">
              <div className="relative">
                {/* Vertical Progress Line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 z-0"></div>
                <div
                  className="absolute left-8 top-0 w-1 bg-linear-to-b from-[#0f5f8a] via-[#22a6dd] to-[#5ec8f2] transition-all duration-1000 ease-out"
                  style={{ height: `${progressPercentage}%` }}
                ></div>

                {/* Vertical Timeline Steps */}
                <div className="relative space-y-8">
                  {orderSteps.map((step) => (
                    <div key={step.id} className="flex items-start">
                      {/* Icon Container */}
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 transition-all duration-300 cursor-pointer shrink-0 ${
                          step.status === "completed"
                            ? "bg-linear-to-br from-[#0f5f8a] via-[#22a6dd] to-[#5ec8f2] shadow-lg"
                            : step.status === "current"
                            ? "bg-white border-4 border-[#22a6dd] shadow-lg animate-pulse"
                            : "bg-gray-100 border-4 border-gray-300"
                        }`}
                        onClick={() => setActiveStep(step.id)}
                      >
                        <div
                          className={`rounded-full flex items-center justify-center ${
                            step.status === "completed" || step.status === "current" ? "w-10 h-10 bg-white" : "w-8 h-8 bg-gray-200"
                          }`}
                        >
                          <Image
                            src={step.icon}
                            alt={step.name}
                            className={`${step.status === "completed" || step.status === "current" ? "w-5 h-5" : "w-4 h-4 opacity-60"}`}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        {/* Status Badge */}
                        <div className="mb-2">
                          {step.status === "completed" && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Completed
                            </span>
                          )}
                          {step.status === "current" && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              <svg className="w-3 h-3 mr-1 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              In Progress
                            </span>
                          )}
                          {step.status === "upcoming" && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Upcoming
                            </span>
                          )}
                        </div>

                        {/* Step Name */}
                        <h3 className="font-semibold text-gray-800 mb-1">{step.name}</h3>

                        {/* Date */}
                        <p className="text-sm text-gray-600 mb-1">{step.date}</p>
                        {step.time && <p className="text-xs text-gray-500 mb-2">{step.time}</p>}

                        {/* Description */}
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop: Horizontal Timeline */}
            <div className="hidden md:block">
              <div className="relative">
                {/* Horizontal Progress Line */}
                <div className="absolute top-10 left-0 right-0 h-1 bg-gray-200 z-0"></div>
                <div
                  className="absolute top-10 left-0 h-1 bg-linear-to-br from-[#0f5f8a] via-[#22a6dd] to-[#5ec8f2] transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>

                {/* Horizontal Timeline Steps */}
                <div className="relative flex justify-between">
                  {orderSteps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center w-1/5">
                      {/* Icon Container */}
                      <div
                        className={`w-18 h-18 rounded-full flex items-center justify-center mb-4 transition-all duration-300 cursor-pointer ${
                          step.status === "completed"
                            ? "bg-linear-to-br from-[#0f5f8a] via-[#22a6dd] to-[#5ec8f2] shadow-lg"
                            : step.status === "current"
                            ? "bg-white border-2 border-[#22a6dd] shadow-lg animate-pulse"
                            : "bg-gray-100 border-2 border-gray-300"
                        }`}
                        onClick={() => setActiveStep(step.id)}
                      >
                        <div
                          className={`rounded-full flex items-center justify-center ${
                            step.status === "completed" || step.status === "current" ? "w-16 h-16 bg-white" : "w-14 h-14 bg-gray-200"
                          }`}
                        >
                          <Image
                            src={step.icon}
                            alt={step.name}
                            className={`${step.status === "completed" || step.status === "current" ? "w-8 h-8" : "w-6 h-6 opacity-60"}`}
                          />
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="mb-2">
                        {step.status === "completed" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Completed
                          </span>
                        )}
                        {step.status === "current" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            <svg className="w-3 h-3 mr-1 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            In Progress
                          </span>
                        )}
                        {step.status === "upcoming" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Upcoming
                          </span>
                        )}
                      </div>

                      {/* Step Name */}
                      <h3 className="font-semibold text-sm text-gray-800 text-center mb-1">{step.name}</h3>

                      {/* Date */}
                      <p className="text-sm text-gray-600 text-center mb-1">{step.date}</p>
                      {step.time && <p className="text-xs text-gray-500 text-center">{step.time}</p>}

                      {/* Description */}
                      <p className="text-xs text-gray-500 text-center mt-2">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- NEW PRODUCT LIST SECTION --- */}
      <div className="track_order_list pb-14">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg px-6 py-4 border border-[#d4d4d4]">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Products</h3>

            <div className="space-y-4">
              {orderProducts.map((product) => (
                <div key={product.id} className="flex items-center pb-2 border-dashed border-b border-gray-300 ">
                         <div className="w-16 h-16 overflow-hidden mr-4 shrink-0 bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 truncate">{product.name}</h4>
                    <p className="text-sm text-gray-600">
                      Color: {product.color} | {product.quantity} Qty.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}