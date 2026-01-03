"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiUser, FiImage, FiStar, FiMessageSquare, FiHash, FiSave, FiArrowLeft } from "react-icons/fi";
import { TestimonialService } from "@/services/testimonial.service";
import { useQueryClient } from "@tanstack/react-query";

export default function TestimonialAddPage() {
  const [loading, setLoading] = useState(false);
  const [customerImage, setCustomerImage] = useState<File | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    customerName: "",
    rating: "5",
    review: "",
    status: "active",
    position: "0",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomerImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!customerImage) return toast.error("Customer image is required");
    if (!form.customerName) return toast.error("Customer name is required");
    if (!form.review) return toast.error("Review is required");

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        fd.append(key, value)
      );
      fd.append("customerImage", customerImage);

      await TestimonialService.create(fd);
      toast.success("Testimonial added successfully");
      
      // Invalidate the testimonials query to refresh the table
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      
      // Navigate back to the testimonial list
      router.push("/cms/testimonial-list");
    } catch (err) {
      toast.error("Failed to add testimonial");
    } finally {
      setLoading(false);
    }
  };

  // Generate star rating options
  const ratingOptions = [1, 2, 3, 4, 5];

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center ">
            <h2 className="text-lg font-semibold text-gray-800">Add Testimonial</h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="border border-[#c5dcdc] rounded-lg p-4">
          <div className="p-6 sm:p-8">
            {/* Customer Image Section */}
            <div className="mb-8">
         
              
              <div className="flex flex-col sm:flex-row gap-6">
            
                
                {/* Image Upload */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-2">Upload Image</p>
                  <label className="mt-1 block">
                    <span className="sr-only">Choose customer image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-teal-50 file:text-teal-700
                        hover:file:bg-teal-100
                        cursor-pointer"
                    />
                  </label>
              
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Customer Name */}
                <div>
                  <label htmlFor="customerName" className="text-gray-700 font-medium flex items-center gap-2 text-sm">
                    <FiUser className="mr-2 text-teal-600" />
                    Customer Name
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={form.customerName}
                    onChange={handleChange("customerName")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label htmlFor="rating" className="text-gray-700 font-medium flex items-center gap-2 text-sm">
                    <FiStar className="mr-2 text-teal-600" />
                    Rating
                  </label>
                  <select
                    id="rating"
                    value={form.rating}
                    onChange={handleChange("rating")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  >
                    {ratingOptions.map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} {rating === 1 ? "Star" : "Stars"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Position */}
                <div>
                  <label htmlFor="position" className="text-gray-700 font-medium flex items-center gap-2 text-sm">
                    <FiHash className="mr-2 text-teal-600" />
                    Position
                  </label>
                  <input
                    id="position"
                    type="number"
                    value={form.position}
                    onChange={handleChange("position")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="0"
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={handleChange("status")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Review */}
                <div className="md:col-span-2">
                  <label htmlFor="review" className="text-gray-700 font-medium flex items-center gap-2 text-sm">
                    <FiMessageSquare className="mr-2 text-teal-600" />
                    Review
                  </label>
                  <textarea
                    id="review"
                    rows={4}
                    value={form.review}
                    onChange={handleChange("review")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter customer review..."
                  />
                </div>

                     {/* SEO Title */}
                <div>
                  <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <input
                    id="seoTitle"
                    type="text"
                    value={form.seoTitle}
                    onChange={handleChange("seoTitle")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter SEO title"
                  />
                </div>

                {/* SEO Keywords */}
                <div>
                  <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Keywords
                  </label>
                  <input
                    id="seoKeywords"
                    type="text"
                    value={form.seoKeywords}
                    onChange={handleChange("seoKeywords")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="testimonial, review, customer"
                  />
                </div>

                {/* SEO Description */}
                <div className="md:col-span-2">
                  <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    id="seoDescription"
                    rows={3}
                    value={form.seoDescription}
                    onChange={handleChange("seoDescription")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter SEO description"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 sm:px-8 sm:py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2 -ml-1 h-4 w-4" />
                  Save Testimonial
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}