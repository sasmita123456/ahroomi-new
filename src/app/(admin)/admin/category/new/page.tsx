"use client";

import { useState } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { toast } from "react-toastify";
import { FiTag, FiLink, FiImage, FiFileText } from "react-icons/fi";
import { FaLongArrowAltLeft } from "react-icons/fa";

import Link from "next/link";
import { categoryService, CategoryData } from "@/services/category.service";
import { encryptPayload } from "@/utils/encryption";

export default function AddCategoryPage() {
  const queryClient = useQueryClient();
  const [data, setData] = useState({
    categoryName: "",
    slug: "",
    // parentCategory: "",
    shortDesc: "",
    longDesc: "",
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const categoryData: CategoryData = {
        ...data,
      };

      const encryptedPayload = await encryptPayload(categoryData);

      if (encryptedPayload) {
        const response = await categoryService.addCategoryEncrypted(
          encryptedPayload.data,
          encryptedPayload.iv,
          thumbnail || undefined,
          banner || undefined
        );
        if (response && response.outcome === true) {
          toast.success(response.message || "Category Saved Successfully!");
          // Invalidate and refetch category queries
          queryClient.invalidateQueries({ queryKey: ['categories'] });
          // Reset form
          setData({
            categoryName: "",
            slug: "",
            // parentCategory: "",
            shortDesc: "",
            longDesc: "",
          });
          setThumbnail(null);
          setBanner(null);
        } else if (response) {
          toast.error(response.message || "Failed to save category");
        } else {
          toast.error("Unexpected response from server");
        }
      } else {
        const response = await categoryService.addCategory(
          categoryData,
          thumbnail || undefined,
          banner || undefined
        );
        if (response && response.outcome === true) {
          toast.success(response.message || "Category Saved Successfully!");
          // Invalidate and refetch category queries
          queryClient.invalidateQueries({ queryKey: ['categories'] });
          // Reset form
          setData({
            categoryName: "",
            slug: "",
            // parentCategory: "",
            shortDesc: "",
            longDesc: "",
          });
          setThumbnail(null);
          setBanner(null);
        } else if (response) {
          toast.error(response.message || "Failed to save category");
        } else {
          toast.error("Unexpected response from server");
        }
      }
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast.error(
        error.message || "An error occurred while saving the category"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Add Category</h2>
        <Link
          href="/admin/category"
          className="flex items-center gap-1 bg-[#ebf9f2] text-[#056d6e] border border-[#056d6e] font-medium text-sm px-3 py-2 rounded-full transition-all duration-300 hover:bg-[#056d6e] hover:text-white hover:shadow-md"
        >
          <FaLongArrowAltLeft />
          Back to Categories
        </Link>
      </div>

      {/* FORM CONTENT */}
      <div className="bg-white border border-[#c5dcdc] rounded-lg p-4">
        <div className="space-y-2">
          {/* 3 fields per row */}
          <div className="grid grid-cols-6 md:grid-cols-4 gap-4">
            {/* Category Name */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2 text-[15px]">
                <FiTag className="text-[#04535c]" /> Category Name
              </label>
              <input
                type="text"
                value={data.categoryName}
                onChange={handleChange("categoryName")}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>

            {/* Slug */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2 text-[15px]">
                <FiLink className="text-[#04535c]" /> Slug (URL)
              </label>
              <input
                type="text"
                value={data.slug}
                onChange={handleChange("slug")}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>

                   {/* Short Description */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2 text-[15px]">
                <FiFileText className="text-[#04535c]" /> Short Description
              </label>
              <textarea
                rows={1}
                value={data.shortDesc}
                onChange={handleChange("shortDesc")}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>

            {/* Long Description */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2 text-[15px]">
                <FiFileText className="text-[#04535c]" /> Long Description
              </label>
              <textarea
                rows={1}
                value={data.longDesc}
                onChange={handleChange("longDesc")}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>

                   {/* Thumbnail */}
              <div>
                <label className="text-gray-700 font-medium flex items-center gap-2 text-[15px]">
                  <FiImage className="text-[#04535c]" /> Category Image
                  (Thumbnail)
                </label>

                <div className="mt-1">
                  <label className="block w-full cursor-pointer">
                    <div className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                      {thumbnail ? thumbnail.name : "Choose File"}
                    </div>

                    {/* HIDDEN INPUT */}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setThumbnail(e.target.files?.[0] || null)
                      }
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>

                      {/* Banner Image */}
              <div>
                <label className="text-gray-700 font-medium flex items-center gap-2 text-[15px]">
                  <FiImage className="text-[#04535c]" /> Category Banner Image
                </label>

                <div className="mt-1">
                  <label className="block w-full cursor-pointer">
                    <div className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                      {banner ? banner.name : "Choose File"}
                    </div>

                    {/* HIDDEN INPUT */}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setBanner(e.target.files?.[0] || null)}
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>

            {/* Parent Category */}
            {/* <div>
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FiTag className="text-[#04535c]" /> Parent Category
              </label>
              <input
                type="text"
                value={data.parentCategory}
                onChange={handleChange("parentCategory")}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div> */}
          </div>
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="mt-6 flex gap-3 justify-center">
        <button
          onClick={() => history.back()}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-full font-medium border border-gray-400 text-gray-500 transition-all duration-300 hover:bg-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#056d6e] text-white hover:bg-[#04535c]"
          }`}
        >
          {loading ? "Saving..." : "Save Category"}
        </button>
      </div>
    </section>
  );
}
