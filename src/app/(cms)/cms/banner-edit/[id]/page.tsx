"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FiImage,
  FiLink,
  FiTag,
  FiHash,
  FiX,
  FiSave,
  FiArrowLeft,
} from "react-icons/fi";
import { BannerService } from "@/services/banner.service";
import { useQueryClient } from "@tanstack/react-query";

export default function BannerEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");

  const [form, setForm] = useState({
    altText: "",
    link: "",
    position: "",
    status: "active",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  const handleChange =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // 🔹 Load banner
  useEffect(() => {
    if (!id) return;

    const fetchBanner = async () => {
      try {
        setLoading(true);
        const res = await BannerService.getById(id);
        const banner = res.data;

        setExistingImage(banner.image);

        // Handle both nested and flat SEO fields
        setForm({
          altText: banner.altText || "",
          link: banner.link || "",
          position: banner.position?.toString() || "",
          status: banner.status || "active",
          seoTitle: banner.seo?.title || banner.seoTitle || "",
          seoDescription:
            banner.seo?.description || banner.seoDescription || "",
          seoKeywords: banner.seo?.keywords || banner.seoKeywords || "",
        });
      } catch {
        toast.error("Failed to load banner");
        router.push("/cms/banner-list");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [id, router]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  // 🔹 Update banner
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));

      // Only append image if changed
      if (image) {
        fd.append("image", image);
      }

      await BannerService.update(id, fd);
      toast.success("Banner updated successfully");

      // Invalidate the banners query to refresh the table
      queryClient.invalidateQueries({
        queryKey: ["banners"],
        exact: false,
      });

      router.push("/cms/banner-list");
    } catch {
      toast.error("Failed to update banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="">
        {/* Header */}
        <div className="mb-2">
          <div className="flex items-center mb-2">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
              aria-label="Go back"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">Edit Banner</h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="border border-[#c5dcdc] rounded-lg p-4">
          <div className="">
            {/* Image Section */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <FiImage className="mr-2 text-[#04535c]" />
                Banner Image
              </h3>

              <div className="flex flex-col sm:flex-row gap-6">
                {/* Current Image */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Current Image
                  </p>
                  <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 h-48 flex items-center justify-center">
                    {existingImage && !image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/banners/${existingImage}`}
                        className="w-full h-full object-cover"
                        alt="Current Banner"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          No current image
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* New Image Preview */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    New Image Preview
                  </p>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 h-48 flex items-center justify-center">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          className="w-full h-full object-cover"
                          alt="New Banner Preview"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          No image selected
                        </p>
                      </div>
                    )}
                  </div>

                  <label className="mt-3 block">
                    <span className="sr-only">Choose a new image</span>
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
              <h3 className="text-base font-semibold text-gray-900">
                Banner Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Alt Text */}
                <div>
                  <label
                    htmlFor="altText"
                    className="text-sm font-medium text-gray-700  flex items-center"
                  >
                    <FiTag className="mr-2 text-[#04535c]" />
                    Alt Text
                  </label>
                  <input
                    id="altText"
                    type="text"
                    value={form.altText}
                    onChange={handleChange("altText")}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
                    placeholder="Enter alt text for accessibility"
                  />
                </div>

                {/* Link */}
                <div>
                  <label
                    htmlFor="link"
                    className="text-sm font-medium text-gray-700  flex items-center"
                  >
                    <FiLink className="mr-2 text-[#04535c]" />
                    Redirect Link
                  </label>
                  <input
                    id="link"
                    type="text"
                    value={form.link}
                    onChange={handleChange("link")}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
                    placeholder="https://example.com/page"
                  />
                </div>

                {/* Position */}
                <div>
                  <label
                    htmlFor="position"
                    className="text-sm font-medium text-gray-700  flex items-center"
                  >
                    <FiHash className="mr-2 text-[#04535c]" />
                    Position
                  </label>
                  <input
                    id="position"
                    type="number"
                    value={form.position}
                    onChange={handleChange("position")}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
                    placeholder="1"
                  />
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="text-sm font-medium text-gray-700  flex items-center"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={handleChange("status")}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SEO Section */}
            <div className="mt-8 space-y-6 border-t pt-6">
              <h3 className="text-base font-semibold text-gray-900">
                SEO Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* SEO Title */}
                <div>
                  <label
                    htmlFor="seoTitle"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    SEO Title
                  </label>
                  <input
                    id="seoTitle"
                    type="text"
                    value={form.seoTitle}
                    onChange={handleChange("seoTitle")}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
                    placeholder="Enter SEO title"
                  />
                </div>

                {/* SEO Keywords */}
                <div>
                  <label
                    htmlFor="seoKeywords"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    SEO Keywords
                  </label>
                  <input
                    id="seoKeywords"
                    type="text"
                    value={form.seoKeywords}
                    onChange={handleChange("seoKeywords")}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
                    placeholder="banner, homepage, promotion"
                  />
                </div>

                {/* SEO Description */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="seoDescription"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    SEO Description
                  </label>
                  <textarea
                    id="seoDescription"
                    rows={1}
                    value={form.seoDescription}
                    onChange={handleChange("seoDescription")}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
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
              className="px-4 py-2 text-sm rounded-full font-medium border border-gray-400 text-gray-500 transition-all duration-300 hover:bg-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex px-4 py-2 rounded-full font-medium text-sm bg-[#056d6e] text-white hover:bg-[#04535c] transition-all duration-300"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <FiSave className="mr-2 -ml-1 h-4 w-4" />
                  Update Banner
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
