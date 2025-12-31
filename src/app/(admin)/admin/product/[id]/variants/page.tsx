"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductVariant, AddVariantData, UpdateVariantData, variantService } from "@/services/variant.service";
import { productService } from "@/services/product.service";
import { StandardResponse } from "@/types/api.types";
import { toast } from "react-toastify";

const VariantManagementPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const productId = id;
  
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);

  // Ensure productId is available before making API calls
  if (!productId) {
    return <div>Product ID is required</div>;
  }
  
  const [formData, setFormData] = useState<AddVariantData>({
    size: "",
    sku: "",
    quantity: 0
  });

  // Fetch product variants
  useEffect(() => {
    const fetchVariants = async () => {
      try {
        setLoading(true);
        const response = await variantService.getProductVariants(productId);
        if (response.outcome) {
          setVariants(response.data || []);
        } else {
          toast.error(response.message || "Failed to fetch variants");
        }
      } catch (error) {
        console.error("Error fetching variants:", error);
        toast.error("Error fetching variants");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchVariants();
    }
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingVariant) {
        // Update existing variant
        const updateData: UpdateVariantData = {
          size: formData.size,
          sku: formData.sku,
          quantity: formData.quantity,
        };
        
        const response = await variantService.updateProductVariant(
          productId, 
          editingVariant._id!, 
          updateData
        );
        
        if (response.outcome) {
          toast.success(response.message || "Variant updated successfully");
          setVariants(prev => prev.map(v => v._id === editingVariant._id ? { ...v, ...updateData } : v));
          setEditingVariant(null);
          setShowAddForm(false);
          setFormData({ size: "", sku: "", quantity: 0 });
        } else {
          toast.error(response.message || "Failed to update variant");
        }
      } else {
        // Add new variant
        const response = await variantService.addVariantToProduct(productId, formData);
        
        if (response.outcome && response.data) {
          toast.success(response.message || "Variant added successfully");
          setVariants(prev => [...prev, response.data]);
          setShowAddForm(false);
          setFormData({ size: "", sku: "", quantity: 0 });
        } else {
          toast.error(response.message || "Failed to add variant");
        }
      }
    } catch (error) {
      console.error("Error saving variant:", error);
      toast.error("Error saving variant");
    }
  };

  const handleEdit = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setFormData({
      size: variant.size,
      sku: variant.sku,
      quantity: variant.quantity
    });
    setShowAddForm(true);
  };

  const handleDelete = async (variantId: string) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      try {
        const response: StandardResponse = await variantService.deleteProductVariant(productId, variantId);
        
        if (response.outcome) {
          toast.success(response.message || "Variant deleted successfully");
          setVariants(prev => prev.filter(v => v._id !== variantId));
        } else {
          toast.error(response.message || "Failed to delete variant");
        }
      } catch (error) {
        console.error("Error deleting variant:", error);
        toast.error("Error deleting variant");
      }
    }
  };

  const handleToggleStatus = async (variantId: string) => {
    try {
      const response = await variantService.toggleProductVariantStatus(productId, variantId);
      
      if (response.outcome) {
        toast.success(response.message || "Variant status updated successfully");
        setVariants(prev => 
          prev.map(v => 
            v._id === variantId ? { ...v, isActive: !v.isActive } : v
          )
        );
      } else {
        toast.error(response.message || "Failed to update variant status");
      }
    } catch (error) {
      console.error("Error toggling variant status:", error);
      toast.error("Error toggling variant status");
    }
  };

  const handleCancel = () => {
    setEditingVariant(null);
    setShowAddForm(false);
    setFormData({ size: "", sku: "", quantity: 0 });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading variants...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Variants Management</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {showAddForm ? "Cancel" : "Add Variant"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingVariant ? "Edit Variant" : "Add New Variant"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Size</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Size</option>
                  <option value="ml">ml</option>
                  <option value="g">g</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                {editingVariant ? "Update" : "Add"} Variant
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Variants List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {variants.length > 0 ? (
              variants.map((variant) => (
                <tr key={variant._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{variant.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{variant.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{variant.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${variant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {variant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleToggleStatus(variant._id!)}
                      className={`mr-2 ${variant.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                    >
                      {variant.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(variant)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(variant._id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No variants found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VariantManagementPage;