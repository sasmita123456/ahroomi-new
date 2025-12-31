"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiTag, FiLink, FiImage, FiFileText, FiPackage } from "react-icons/fi";
import { FaLongArrowAltLeft } from "react-icons/fa";
import Link from "next/link";
import {
  productService,
  ProductData,
  CategoryOption,
} from "@/services/product.service";
import { encryptPayload } from "@/utils/encryption";

export default function AddProductPage() {
  const [data, setData] = useState({
    productName: "",
    productSlug: "",
    category: "",
    tags: [] as string[],
    shortDescription: "",
    longDescription: "",
    sku: "",
  });

  const [tagsInput, setTagsInput] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await productService.getActiveCategories();
        if (response && response.outcome === true && response.data) {
          setCategories(response.data);
        }
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        toast.error(error.message || "Failed to fetch categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagsInput.trim() !== "") {
      const newTags = [...data.tags, tagsInput.trim()];
      setData({ ...data, tags: newTags });
      setTagsInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...data.tags];
    newTags.splice(index, 1);
    setData({ ...data, tags: newTags });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Validation
      if (!data.productName) {
        toast.error("Product Name is required");
        setLoading(false);
        return;
      }

      if (!data.productSlug) {
        toast.error("Product Slug is required");
        setLoading(false);
        return;
      }

      if (!data.category) {
        toast.error("Category is required");
        setLoading(false);
        return;
      }

      if (!data.sku) {
        toast.error("SKU is required");
        setLoading(false);
        return;
      }

      const productData: ProductData = {
        ...data,
      };

      const encryptedPayload = await encryptPayload(productData);

      if (encryptedPayload) {
        const response = await productService.addProductEncrypted(
          encryptedPayload.data,
          encryptedPayload.iv
        );

        if (response && response.outcome === true) {
          toast.success(response.message || "Product Saved Successfully!");
          // Reset form
          setData({
            productName: "",
            productSlug: "",
            category: "",
            tags: [],
            shortDescription: "",
            longDescription: "",
            sku: "",
          });
          setTagsInput("");
        } else if (response) {
          toast.error(response.message || "Failed to save product");
        } else {
          toast.error("Unexpected response from server");
        }
      } else {
        const response = await productService.addProduct(productData);

        if (response && response.outcome === true) {
          toast.success(response.message || "Product Saved Successfully!");
          // Reset form
          setData({
            productName: "",
            productSlug: "",
            category: "",
            tags: [],
            shortDescription: "",
            longDescription: "",
            sku: "",
          });
          setTagsInput("");
        } else if (response) {
          toast.error(response.message || "Failed to save product");
        } else {
          toast.error("Unexpected response from server");
        }
      }
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(
        error.message || "An error occurred while saving the product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Add Product</h2>
        <Link
          href="/admin/product"
          className="flex items-center gap-1 bg-[#ebf9f2] text-[#056d6e] border border-[#056d6e] font-medium text-sm px-3 py-2 rounded-full transition-all duration-300 hover:bg-[#056d6e] hover:text-white hover:shadow-md"
        >
          <FaLongArrowAltLeft />
          Back to Products
        </Link>
      </div>

      {/* FORM CONTENT */}
      <div className="bg-white border border-[#c5dcdc] rounded-lg p-4">
        <div className="space-y-2">
          {/* Product Name and Slug */}
          <div className="grid grid-cols-6 md:grid-cols-4 gap-4">
            {/* Product Name */}
            <div>
              <label className="text-gray-700 text-[15px] font-medium flex items-center gap-2">
                <FiTag className="text-[#056a6b]" /> Product Name *
              </label>
              <input
                type="text"
                value={data.productName}
                onChange={handleChange("productName")}
                placeholder="Enter product name"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056a6b] focus:border-[#056a6b] sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>

            {/* Product Slug */}
            <div>
              <label className="text-gray-700 text-[15px]  font-medium flex items-center gap-2">
                <FiLink className="text-[#056a6b]" /> Product Slug *
              </label>
              <input
                type="text"
                value={data.productSlug}
                onChange={handleChange("productSlug")}
                placeholder="Enter product slug"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056a6b] focus:border-[#056a6b] sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-gray-700 text-[15px]  font-medium flex items-center gap-2">
                <FiTag className="text-[#056a6b]" /> Category *
              </label>
              {loadingCategories ? (
                <div className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-gray-500">
                  Loading categories...
                </div>
              ) : (
                <select
                  value={data.category}
                  onChange={(e) =>
                    setData({ ...data, category: e.target.value })
                  }
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900"
                  disabled={loading}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* SKU */}
            <div>
              <label className="text-gray-700 text-[15px]  font-medium flex items-center gap-2">
                <FiPackage className="text-[#056a6b]" /> SKU *
              </label>
              <input
                type="text"
                value={data.sku}
                onChange={handleChange("sku")}
                placeholder="Enter product SKU"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056a6b] focus:border-[#056a6b] sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>

            {/* Tags */}
            <div className="col-span-2">
              <label className="text-gray-700 text-[15px]  font-medium flex items-center gap-2">
                <FiTag className="text-[#056a6b]" /> Tags
              </label>
              <div className="flex mt-1">
                <input
                  type="text"
                  value={tagsInput}
                  onChange={handleTagsChange}
                  placeholder="Enter tags (comma separated)"
                  className="grow p-2 border border-gray-300 rounded-l-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056a6b] focus:border-[#056a6b] sm:text-sm transition duration-150"
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-[#056a6b] hover:bg-[#04535c] text-white px-4 py-2 rounded-r-lg transition-colors"
                  disabled={loading}
                >
                  Add
                </button>
              </div>
              {/* Display tags */}
              <div className="mt-2 flex flex-wrap gap-2">
                {data.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="text-blue-800 hover:text-blue-900 font-bold"
                      disabled={loading}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="text-gray-700 text-[15px]  font-medium flex items-center gap-2">
                <FiFileText className="text-[#056a6b]" /> Short Description
              </label>
              <textarea
                rows={3}
                value={data.shortDescription}
                onChange={handleChange("shortDescription")}
                placeholder="Enter short description"
                className="w-full h-10 mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056a6b] focus:border-[#056a6b] sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>

            {/* Long Description */}
            <div>
              <label className="text-gray-700 text-[15px]  font-medium flex items-center gap-2">
                <FiFileText className="text-[#056a6b]" /> Long Description
              </label>
              <textarea
                rows={3}
                value={data.longDescription}
                onChange={handleChange("longDescription")}
                placeholder="Enter long description"
                className="w-full h-10 mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#056a6b] focus:border-[#056a6b] sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>
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
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </section>
  );
}
