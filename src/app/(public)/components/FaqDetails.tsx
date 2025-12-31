"use client";
import { useState } from "react";
import { FaChevronDown, FaSearch, FaLightbulb } from "react-icons/fa";
import vector3 from "../../../../public/assets/images/vector3.svg";
import Image from "next/image";

export default function FaqDetails() {
  // CORRECTED: Allow null for the "closed" state, but initialize with 0 to open the first item.
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const faqs = [
    {
      id: 1,
      question: "How can I place an order?",
      answer:
        "You can place an order through our website by browsing products, adding items to your cart, and proceeding to checkout. Follow the simple steps to provide shipping information and payment details to complete your purchase.",
      category: "ordering",
      tags: ["orders", "purchasing"],
    },
    {
      id: 2,
      question: "What information do I need to provide when placing an order?",
      answer:
        "You'll need to provide your full name, shipping address, contact number, email address, and payment information. Make sure all details are accurate to ensure smooth delivery of your order.",
      category: "ordering",
      tags: ["account", "payment"],
    },
    {
      id: 3,
      question: "Can I make changes to my order after it has been placed?",
      answer:
        "Changes can be made within 2 hours of placing your order. After this period, the order enters our fulfillment process and cannot be modified. Please contact our customer service immediately if you need to make changes.",
      category: "orders",
      tags: ["modification", "changes"],
    },
    {
      id: 4,
      question: "How can I check the status of my order?",
      answer:
        "You can check your order status by logging into your account on our website and viewing your order history. You'll also receive email updates at each stage of your order processing and delivery.",
      category: "orders",
      tags: ["tracking", "status"],
    },
    {
      id: 5,
      question: "What should I do if my order arrives damaged or incomplete?",
      answer:
        "If your order arrives damaged or incomplete, please contact our customer service within 48 hours with photos of the damaged items or packaging. We'll arrange for a replacement or refund as appropriate.",
      category: "support",
      tags: ["returns", "refunds"],
    },
    {
      id: 6,
      question: "What are the features and specifications of the product?",
      answer:
        "Each product page includes detailed specifications, features, dimensions, and materials used. You can also find customer reviews and ratings to help you make an informed decision.",
      category: "products",
      tags: ["specs", "features"],
    },
    {
      id: 7,
      question: "Can I pre-order a product that is out of stock?",
      answer:
        "Yes, many of our products are available for pre-order. You'll be notified via email when the product is back in stock, and your order will be processed at that time. Pre-orders often come with special discounts.",
      category: "products",
      tags: ["pre-order", "stock"],
    },
    {
      id: 8,
      question: "How do I assemble or set up the product?",
      answer:
        "Most products come with detailed assembly instructions in the package. You can also find video tutorials on our website or YouTube channel. For complex assemblies, we offer professional installation services.",
      category: "support",
      tags: ["assembly", "setup"],
    },
    {
      id: 9,
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through encrypted channels.",
      category: "payment",
      tags: ["payment", "security"],
    },
    {
      id: 10,
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days, while express shipping delivers within 1-2 business days. International shipping typically takes 7-14 business days depending on the destination.",
      category: "shipping",
      tags: ["delivery", "time"],
    },
  ];

  const categories = [
    { id: "all", name: "All Questions", count: faqs.length },
    {
      id: "ordering",
      name: "Ordering",
      count: faqs.filter((f) => f.category === "ordering").length,
    },
    {
      id: "orders",
      name: "My Orders",
      count: faqs.filter((f) => f.category === "orders").length,
    },
    {
      id: "products",
      name: "Products",
      count: faqs.filter((f) => f.category === "products").length,
    },
    {
      id: "shipping",
      name: "Shipping",
      count: faqs.filter((f) => f.category === "shipping").length,
    },
    {
      id: "payment",
      name: "Payment",
      count: faqs.filter((f) => f.category === "payment").length,
    },
    {
      id: "support",
      name: "Support",
      count: faqs.filter((f) => f.category === "support").length,
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-14 px-4 relative">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-4">
            How can we <span className="text-[#22a6dd]">help you?</span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about ordering, shipping, products,
            and more.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Left Column - FAQ Content */}
          <div className="lg:col-span-2">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-[#22a6dd] text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {category.name}
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                      selectedCategory === category.id
                        ? "bg-[#007bcb]"
                        : "bg-gray-200"
                    }`}
                  >
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    <button
                      className="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 group"
                      onClick={() => toggleFAQ(index)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="mt-1 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
                          <span className="text-blue-600 font-semibold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-700 text-base group-hover:text-blue-500 transition-colors">
                            {faq.question}
                          </h3>
                        </div>
                      </div>
                      <FaChevronDown
                        className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 shrink-0 ${
                          activeIndex === index
                            ? "rotate-180 text-blue-500"
                            : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        activeIndex === index ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="px-6 pb-6 ml-12">
                        <div className="pl-4 border-l-2 border-blue-200">
                          <p className="text-gray-700 leading-relaxed text-sm">
                            {faq.answer}
                          </p>
                          {activeIndex === index && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <p className="text-sm text-gray-500">
                                Was this helpful?
                                <span className="ml-4 space-x-2">
                                  <button className="text-green-600 hover:text-green-700 font-medium">
                                    Yes
                                  </button>
                                  <button className="text-red-600 hover:text-red-700 font-medium">
                                    No
                                  </button>
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                  <FaLightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No questions found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter to find what you're
                    looking for.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact Section */}
          <div className="lg:col-span-1 px-6 relative">
            <div className="">
              {/* Search Bar */}
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for questions..."
                  className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="widget-wrapper bg-white p-6 mb-8 rounded-xl shadow-sm border border-gray-200">
                <h4 className="widget-title text-gray-900 text-xl font-semibold mb-3 pb-3 border-b border-gray-100">
                  Categories
                </h4>
                <ul className="">
                  <li className="cat-item group">
                    <a
                      href="#"
                      className="relative flex items-center text-gray-700 hover:text-gray-900 transition-all duration-300 pl-6 py-2 "
                    >
                      <span className="absolute left-0 w-2 h-2 bg-gray-400 rounded-full group-hover:bg-gray-900 transition-colors duration-300"></span>
                      <span className="relative overflow-hidden">
                        Beauty
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300 ease-out"></span>
                      </span>
                    </a>
                  </li>
                  <li className="cat-item group">
                    <a
                      href="#"
                      className="relative flex items-center text-gray-700 hover:text-gray-900 transition-all duration-300 pl-6 py-2"
                    >
                      <span className="absolute left-0 w-2 h-2 bg-gray-400 rounded-full group-hover:bg-gray-900 transition-colors duration-300"></span>
                      <span className="relative overflow-hidden">
                        Beauty Blog
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300 ease-out"></span>
                      </span>
                    </a>
                  </li>
                  <li className="cat-item group">
                    <a
                      href="#"
                      className="relative flex items-center text-gray-700 hover:text-gray-900 transition-all duration-300 pl-6 py-2 "
                    >
                      <span className="absolute left-0 w-2 h-2 bg-gray-400 rounded-full group-hover:bg-gray-900 transition-colors duration-300"></span>
                      <span className="relative overflow-hidden">
                        Body Care
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300 ease-out"></span>
                      </span>
                    </a>
                  </li>
                  <li className="cat-item group">
                    <a
                      href="#"
                      className="relative flex items-center text-gray-700 hover:text-gray-900 transition-all duration-300 pl-6 py-2"
                    >
                      <span className="absolute left-0 w-2 h-2 bg-gray-400 rounded-full group-hover:bg-gray-900 transition-colors duration-300"></span>
                      <span className="relative overflow-hidden">
                        Cosmetics
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300 ease-out"></span>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="widget-wrapper_contact p-6 bg-white text-center">
                <h4 className="widget-title text-gray-900 text-xl mb-3 font-semibold">
                  Contact Us
                </h4>

                <p className="text-gray-700 text-sm mb-5 leading-relaxed">
                  Have questions or need assistance? Our team is always ready to
                  help. Get in touch with us and we'll respond as quickly as
                  possible.
                </p>

                <button className="relative bg-white text-sm text-black px-4 py-2 tracking-wider whitespace-nowrap border border-black overflow-hidden group transition-all duration-500 hover:text-white">
                  <span className="relative z-10">Contact Us</span>

                  <div className="absolute inset-0 bg-black transform -translate-x-full transition-transform duration-500 group-hover:translate-x-0"></div>
                </button>
              </div>
           
            </div>
          </div>

               <div className="absolute bottom-0 right-0">
                <Image src={vector3} alt="Vector3" />
              </div>
        </div>
      </div>
    
    </section>
  );
}
