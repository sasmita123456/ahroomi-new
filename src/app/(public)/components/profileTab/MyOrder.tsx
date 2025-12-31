"use client";

import Image from "next/image";
import plix1 from "../../../../../public/assets/images/plix1.png";
import plix3 from "../../../../../public/assets/images/plix3.png";
import {
  FiShoppingBag,
  FiTruck,
  FiFileText,
  FiX,
  FiStar,
  FiCalendar,
  FiCreditCard,
  FiPackage,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import Link from "next/link";

// Define order item type
export interface OrderItem {
  id: string;
  name: string;
  color: string;
  quantity: number;
  price: number;
  image?: string; // Optional image property
}

// Define order type
export interface Order {
  id: string;
  totalAmount: number;
  paymentMethod: string;
  status: "Processing" | "Accepted" | "Delivered";
  deliveryDate?: string;
  expectedDelivery?: string;
  items: OrderItem[];
  orderDate?: string; // Added order date
}

// Define props for the MyOrder component
interface MyOrderProps {
  orders: Order[];
}

export default function MyOrder({ orders }: MyOrderProps) {
  // Function to get the appropriate image based on product
  const getProductImage = (productName: string) => {
    // More specific logic to determine which image to use
    if (productName.toLowerCase().includes("apple cider vinegar")) {
      return plix1;
    } else if (productName.toLowerCase().startsWith("acv")) {
      return plix3;
    } else {
      // Default to plix1 for any other products
      return plix1;
    }
  };

  // Function to get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Delivered":
        return {
          icon: <FiCheckCircle className="w-4 h-4" />,
          bgColor: "bg-green-100",
          textColor: "text-green-800",
        };
      case "Accepted":
        return {
          icon: <FiClock className="w-4 h-4" />,
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
        };
      case "Processing":
      default:
        return {
          icon: <FiPackage className="w-4 h-4" />,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
        };
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Orders</h2>
        <div className="flex items-center text-sm text-gray-600">
          <FiShoppingBag className="w-4 h-4 mr-2" />
          <span>{orders.length} Orders</span>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          return (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center mb-2 md:mb-0">
                    <div className="mr-4">
                      <h3 className="font-semibold text-gray-800">
                        Order ID: {order.id}
                      </h3>
                      {order.orderDate && (
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <FiCalendar className="w-3 h-3 mr-1" />
                          Ordered on: {order.orderDate}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center ${statusInfo.bgColor} ${statusInfo.textColor}`}
                      >
                        {statusInfo.icon}
                        <span className="ml-1">{order.status}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 md:mt-0">
                    <div className="flex items-center text-sm text-gray-600 mr-4">
                      <FiCreditCard className="w-4 h-4 mr-1" />
                      {order.paymentMethod}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row md:items-center"
                    >
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 mr-4 shrink-0">
                          <Image
                            src={getProductImage(item.name)}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Color: {item.color} | Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="md:ml-auto">
                        <p className="font-semibold text-gray-800">
                          ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Details */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <p className="text-sm text-gray-600 flex items-center">
                        <FiTruck className="w-4 h-4 mr-1" />
                        {order.deliveryDate
                          ? `Delivered on: ${order.deliveryDate}`
                          : `Expected Delivery: ${order.expectedDelivery}`}
                      </p>
                      <p className="text-base font-semibold text-gray-800 mt-1">
                        Total: ₹{order.totalAmount}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {order.status !== "Delivered" && (
                        <>
                          <Link href="/tracker">
                            <button className="flex items-center gap-1 px-4 py-2 text-sm bg-[#22a6dd] text-white rounded-md hover:bg-opacity-90 transition-colors">
                              <FiTruck className="w-4 h-4" />
                              Track Order
                            </button>
                          </Link>
                          {order.status === "Accepted" && (
                            <button className="flex items-center gap-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                              <FiX className="w-4 h-4" />
                              Cancel Order
                            </button>
                          )}
                        </>
                      )}
                      <button className="flex items-center gap-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                        <FiFileText className="w-4 h-4" />
                        Invoice
                      </button>
                      {order.status === "Delivered" && (
                        <button className="flex items-center gap-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                          <FiStar className="w-4 h-4" />
                          Add Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
