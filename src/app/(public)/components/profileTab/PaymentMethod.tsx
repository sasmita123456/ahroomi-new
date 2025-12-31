"use client";

import { useState } from "react";
import {
  FiCreditCard,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiX,
  FiLock,
  FiEdit,
  FiExternalLink,
  FiCheckCircle,
} from "react-icons/fi";
import { SiVisa, SiPaypal, SiGooglepay } from "react-icons/si";

// Define TypeScript interface for a Payment Method
interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "google-pay";
  brand?: string;
  lastFourDigits?: string;
  holderName?: string;
  email?: string;
  expiryDate?: string;
  isDefault?: boolean;
  isLinked?: boolean;
  isVerified?: boolean; // New property to track if account is verified
}

// Define TypeScript interface for the card form data
interface CardFormData {
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  saveForFuture: boolean;
}

export default function PaymentMethod() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      brand: "VISA",
      lastFourDigits: "8047",
      holderName: "Subhadra Patel",
      expiryDate: "12/25",
      isDefault: true,
      isVerified: true, // Mark VISA card as verified
    },
    {
      id: "3",
      type: "paypal",
      isLinked: false,
    },
    {
      id: "4",
      type: "google-pay",
      isLinked: false,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [linkingProvider, setLinkingProvider] = useState<string | null>(null);

  const [formData, setFormData] = useState<CardFormData>({
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    saveForFuture: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
    }

    // Format expiry date
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .substr(0, 5);
    }

    // Format CVV
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").substr(0, 4);
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : formattedValue,
    });
  };

  const detectCardBrand = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, "");
    if (cleaned.startsWith("4")) return "VISA";
    if (/^5[1-5]/.test(cleaned)) return "Mastercard";
    if (/^3[47]/.test(cleaned)) return "AMEX";
    return "VISA";
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: "card",
      brand: detectCardBrand(formData.cardNumber),
      lastFourDigits: formData.cardNumber.replace(/\s/g, "").slice(-4),
      holderName: formData.cardHolderName,
      expiryDate: formData.expiryDate,
      isDefault: false,
      isVerified: false, // New cards are not verified by default
    };

    if (editingId) {
      setPaymentMethods(
        paymentMethods.map((method) =>
          method.id === editingId
            ? { ...newCard, id: editingId, isDefault: method.isDefault, isVerified: method.isVerified }
            : method
        )
      );
      setEditingId(null);
    } else {
      setPaymentMethods([...paymentMethods, newCard]);
    }

    setFormData({
      cardHolderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      saveForFuture: true,
    });
    setShowForm(false);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      cardHolderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      saveForFuture: true,
    });
  };



  const getCardIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case "visa":
        return <SiVisa className="w-8 h-8 text-[#1434CB]" />;
      default:
        return <FiCreditCard className="w-8 h-8 text-gray-600" />;
    }
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "paypal":
        return <SiPaypal className="w-8 h-8 text-[#00457C]" />;
      case "google-pay":
        return <SiGooglepay className="w-8 h-8 text-[#4285F4]" />;
      default:
        return <FiCreditCard className="w-8 h-8 text-gray-600" />;
    }
  };

  const renderPaymentMethodContent = (method: PaymentMethod) => {
    if (method.type === "card") {
      return (
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            {getCardIcon(method.brand)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900 mb-1">
                {method.brand} •••• {method.lastFourDigits}
              </h3>
              {method.isVerified && (
                <div className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  <FiCheckCircle className="w-3 h-3" />
                  Verified Account
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">{method.holderName}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-md">
          {getPaymentIcon(method.type)}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-900 mb-1 capitalize">
            {method.type.replace("-", " ")}
          </h3>
          {method.isLinked ? (
            <p className="text-sm text-gray-600">{method.email}</p>
          ) : (
            <p className="text-sm text-gray-500">Not linked yet</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Payment Methods</h2>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="group cursor-pointer text-sm flex items-center gap-2 px-4 py-2.5 bg-[#f9c11c] text-gray-800 font-semibold rounded-lg shadow-md hover:bg-[#e3af15] transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Add Card
          </button>
        )}
      </div>

      {/* Add/Edit Card Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-lg border border-[#c2e7f7] shadow-xl mb-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#22a6dd] rounded-lg flex items-center justify-center">
                <FiCreditCard className="w-6 h-6 text-white" />
              </div>
              {editingId ? "Edit Card" : "Add New Card"}
            </h3>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleAddCard}>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="cardHolderName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Card Holder Name *
                </label>
                <input
                  type="text"
                  id="cardHolderName"
                  name="cardHolderName"
                  value={formData.cardHolderName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
                  placeholder="Name as shown on card"
                />
              </div>

              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Card Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    maxLength={19}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
                    placeholder="1234 5678 9012 3456"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {formData.cardNumber &&
                      getCardIcon(detectCardBrand(formData.cardNumber))}
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="expiryDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Expiry Date *
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                  maxLength={5}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label
                  htmlFor="cvv"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  CVV *
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  required
                  maxLength={4}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
                  placeholder="123"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200 mt-5">
              <FiLock className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-800">
                Your payment information is encrypted and secure
              </p>
            </div>

            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="saveForFuture"
                name="saveForFuture"
                checked={formData.saveForFuture}
                onChange={handleInputChange}
                className="h-3 w-3 text-[#22a6dd] focus:ring-[#22a6dd] border-gray-300 rounded"
              />
              <label
                htmlFor="saveForFuture"
                className="ml-3 text-sm font-medium text-gray-700"
              >
                Save card for future payments
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="group cursor-pointer text-sm flex items-center gap-2 px-4 py-2.5 bg-[#f9c11c] text-gray-800 font-semibold rounded-lg shadow-md hover:bg-[#e3af15] transition-colors"
              >
                <FiCheck className="w-5 h-5" />
                {editingId ? "Update Card" : "Add Card"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Saved Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="bg-white rounded-2xl border-2 border-gray-200 hover:border-[#22a6dd] transition-all duration-300 hover:shadow-xl overflow-hidden group"
          >
            {/* Default Badge */}
            {method.isDefault && (
              <div className="bg-linear-to-r from-[#22a6dd] to-[#1e95c7] px-4 py-2">
                <div className="flex items-center gap-2 text-white text-sm font-semibold">
                  <FiCheck className="w-4 h-4" />
                  Default Payment Method
                </div>
              </div>
            )}

            <div className="p-4">
              <div className="flex items-start justify-between mb-4">
                {renderPaymentMethodContent(method)}
                <div className="flex gap-1">
                  <button
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Payment Method"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                {method.type !== "card" && !method.isLinked && (
                  <button
                    className="flex items-center gap-2 text-sm text-[#22a6dd] hover:text-[#1e95c7] font-semibold hover:underline transition-colors"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    Link Account
                  </button>
                )}
                
                {!method.isDefault && method.isLinked && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    className="text-sm text-[#4caf50] hover:text-[#1e95c7] font-semibold hover:underline transition-colors"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Linking Provider Modal */}
      {linkingProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              {linkingProvider === "paypal" && <SiPaypal className="w-14 h-14 text-[#00457C]" />}
              {linkingProvider === "google-pay" && <SiGooglepay className="w-14 h-14 text-[#4285F4]" />}
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Linking {linkingProvider.replace('-', ' ')}</h3>
            <p className="text-gray-600 text-center mb-4">
              You're being redirected to {linkingProvider.replace('-', ' ')} to authorize the connection.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-[#22a6dd] h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            <p className="text-sm text-gray-500 text-center">
              This window will close automatically when the process is complete.
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {paymentMethods.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCreditCard className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No payment methods saved
          </h3>
          <p className="text-gray-600 mb-6">
            Add a payment method to make checkout faster
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#22a6dd] text-white font-semibold rounded-lg hover:bg-[#1e95c7] transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Add Payment Method
          </button>
        </div>
      )}
    </div>
  );
}