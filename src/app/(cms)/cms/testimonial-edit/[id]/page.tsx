"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiUser, FiImage, FiStar, FiMessageSquare, FiHash, FiSave, FiArrowLeft } from "react-icons/fi";
import { TestimonialService, Testimonial } from "@/services/testimonial.service";
import { useQueryClient } from "@tanstack/react-query";

export default function TestimonialEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [customerImage, setCustomerImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");

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

  // Load testimonial
  useEffect(() => {
    if (!id) return;

    const fetchTestimonial = async () => {
      try {
        setLoading(true);
        const res = await TestimonialService.getById(id);
        const testimonial = res.data;

        setExistingImage(testimonial.customerImage);
        
        // Handle both nested and flat SEO fields
        setForm({
          customerName: testimonial.customerName || "",
          rating: testimonial.rating?.toString() || "5",
          review: testimonial.review || "",
          status: testimonial.status || "active",
          position: testimonial.position?.toString() || "0",
          seoTitle: testimonial.seo?.title || testimonial.seoTitle || "",
          seoDescription: testimonial.seo?.description || testimonial.seoDescription || "",
          seoKeywords: testimonial.seo?.keywords || testimonial.seoKeywords || "",
        });
      } catch (error) {
        console.error("Error loading testimonial:", error);
        toast.error("Failed to load testimonial");
        router.push("/testimonial-list");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonial();
  }, [id, router]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomerImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setCustomerImage(null);
    setImagePreview("");
  };

  // Update testimonial
  const handleSubmit = async () => {
    if (!form.customerName) return toast.error("Customer name is required");
    if (!form.review) return toast.error("Review is required");

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        fd.append(key, value)
      );

      // Only append image if changed
      if (customerImage) {
        fd.append("customerImage", customerImage);
      }

      await TestimonialService.update(id, fd);
      toast.success("Testimonial updated successfully");
      
      // Invalidate the testimonials query to refresh the table
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      
      router.push("/cms/testimonial-list");
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast.error("Failed to update testimonial");
    } finally {
      setLoading(false);
    }
  };

  // Generate star rating options
  const ratingOptions = [1, 2, 3, 4, 5];

  // Show loading state
  if (loading && !form.customerName) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              <p className="mt-4 text-gray-600">Loading testimonial...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
              aria-label="Go back"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Testimonial</h1>
          </div>
          <p className="text-gray-600 ml-12">Update the testimonial details</p>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Customer Image Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiImage className="mr-2 text-teal-600" />
                Customer Image
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Current Image */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Image</p>
                  <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 h-48 w-48 flex items-center justify-center">
                    {existingImage && !imagePreview ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/testimonials/${existingImage}`}
                        className="w-full h-full object-cover"
                        alt="Current Customer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/assets/images/default-avatar.png';
                        }}
                      />
                    ) : (
                      <div className="text-center p-4">
                        <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No current image</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* New Image Preview */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-2">New Image Preview</p>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 h-48 w-48 flex items-center justify-center">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          className="w-full h-full object-cover"
                          alt="New Customer Preview"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No image selected</p>
                      </div>
                    )}
                  </div>
                  
                  <label className="mt-3 block">
                    <span className="sr-only">Choose a new image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-teal-50 file:text-teal-700
                        hover:file:bg-teal-100
                        cursor-pointer disabled:opacity-50"
                    />
                  </label>
                  <p className="mt-2 text-sm text-gray-500">
                    Recommended: Square image, at least 300x300px
                  </p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Testimonial Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Name */}
                <div>
                  <label htmlFor="customerName" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiUser className="mr-2 text-teal-600" />
                    Customer Name
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={form.customerName}
                    onChange={handleChange("customerName")}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="John Doe"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label htmlFor="rating" className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiStar className="mr-2 text-teal-600" />
                    Rating
                  </label>
                  <select
                    id="rating"
                    value={form.rating}
                    onChange={handleChange("rating")}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  <label htmlFor="position" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiHash className="mr-2 text-teal-600" />
                    Position
                  </label>
                  <input
                    id="position"
                    type="number"
                    value={form.position}
                    onChange={handleChange("position")}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Review */}
                <div className="md:col-span-2">
                  <label htmlFor="review" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiMessageSquare className="mr-2 text-teal-600" />
                    Review
                  </label>
                  <textarea
                    id="review"
                    rows={4}
                    value={form.review}
                    onChange={handleChange("review")}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter customer review..."
                  />
                </div>
              </div>
            </div>

            {/* SEO Section */}
            <div className="mt-8 space-y-6 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                  Updating...
                </>
              ) : (
                <>
                  <FiSave className="mr-2 -ml-1 h-4 w-4" />
                  Update Testimonial
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}