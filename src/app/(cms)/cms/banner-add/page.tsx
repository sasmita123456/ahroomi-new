// BannerAddPage component
"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { FiImage, FiLink, FiTag, FiHash } from "react-icons/fi";
import { BannerService } from "@/services/banner.service";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function BannerAddPage() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

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
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!image) return toast.error("Banner image is required");

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      fd.append("image", image);

      await BannerService.create(fd);
      toast.success("Banner added successfully");

      // Invalidate the banners query to refresh the table
      queryClient.invalidateQueries({
        queryKey: ["banners"],
        exact: false,
      });

      // Navigate back to the banner list
      router.push("/cms/banner-list");
    } catch (err) {
      toast.error("Failed to add banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-lg p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Add Banner</h2>
      </div>

      {/* FORM */}
      <div className="border border-[#c5dcdc] rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Banner Image */}
          <div>
            <label className="text-gray-700 font-medium flex items-center gap-2 text-sm">
              <FiImage className="text-[#04535c]" /> Banner Image
            </label>
            <label className="block mt-1 cursor-pointer">
              <div className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm">
                {image ? image.name : "Choose Image (1920 × 770)"}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                disabled={loading}
              />
            </label>
          </div>

          {/* Alt Text */}
          <div>
            <label className="text-gray-700 font-medium flex items-center gap-2 text-sm">
              <FiTag className="text-[#04535c]" /> Alt Text
            </label>
            <input
              value={form.altText}
              onChange={handleChange("altText")}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
            />
          </div>

          {/* Link */}
          <div>
            <label className="text-gray-700 font-medium flex items-center gap-2 text-sm">
              <FiLink className="text-[#04535c]" /> Redirect Link
            </label>
            <input
              value={form.link}
              onChange={handleChange("link")}
              placeholder="/products"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
            />
          </div>

          {/* Position */}
          <div>
            <label className="text-gray-700 font-medium flex items-center gap-2 text-sm">
              <FiHash className="text-[#04535c]" /> Position
            </label>
            <input
              type="number"
              value={form.position}
              onChange={handleChange("position")}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
            />
          </div>

          {/* SEO Title */}
          <div>
            <label className="text-gray-700 font-medium text-sm">
              SEO Title
            </label>
            <input
              value={form.seoTitle}
              onChange={handleChange("seoTitle")}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
            />
          </div>

          {/* SEO Keywords */}
          <div>
            <label className="text-gray-700 font-medium text-sm">
              SEO Keywords
            </label>
            <input
              value={form.seoKeywords}
              onChange={handleChange("seoKeywords")}
              placeholder="banner, ecommerce"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
            />
          </div>

          {/* SEO Description */}
          <div className="md:col-span-2">
            <label className="text-gray-700 font-medium text-sm">
              SEO Description
            </label>
            <textarea
              rows={1}
              value={form.seoDescription}
              onChange={handleChange("seoDescription")}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056d6e] focus:border-[#056d6e] sm:text-sm transition duration-150"
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 flex gap-3 justify-center">
        <button
          onClick={() => router.back()}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-full border border-gray-400 text-gray-500 hover:bg-gray-400 hover:text-white"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            loading
              ? "bg-gray-400"
              : "bg-[#056d6e] text-white hover:bg-[#04535c]"
          }`}
        >
          {loading ? "Saving..." : "Save Banner"}
        </button>
      </div>
    </section>
  );
}
