"use client";

import React, { useState, useEffect } from "react";
import { ProductVariant, AddVariantData, UpdateVariantData, variantService } from "@/services/variant.service";
import { productService, ProductResponse } from "@/services/product.service";
import { StandardResponse } from "@/types/api.types";
import { toast } from "react-toastify";
import ReusableTable from "@/components/Table/ReusableTable";
import { ColumnDef } from "@tanstack/react-table";

export default function VariantManagementPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);

  const [formData, setFormData] = useState<{  // New form data without SKU
    size: string;
    quantity: number;
  }>({
    size: "",
    quantity: 0
  });

  // Define columns for the ReusableTable
  const columns = React.useMemo<ColumnDef<ProductVariant>[]>(
    () => [
      {
        accessorKey: 'size',
        header: 'Size',
      },
      {
        accessorKey: 'sku',
        header: 'SKU',
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.original.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {row.original.isActive ? 'Active' : 'Inactive'}
          </span>
        ),
      },
    ],
    []
  );

  // Extended columns to include product name when needed
  const extendedColumns = React.useMemo<ColumnDef<ProductVariant>[]>(
    () => [
      {
        accessorKey: 'size',
        header: 'Size',
      },
      {
        accessorKey: 'sku',
        header: 'SKU',
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
      },
      {
        header: 'Product Name',
        cell: ({ row }) => {
          const selectedProduct = products.find(p => p._id === selectedProductId);
          return selectedProduct ? selectedProduct.productName : 'N/A';
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.original.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {row.original.isActive ? 'Active' : 'Inactive'}
          </span>
        ),
      },
    ],
    [products, selectedProductId]
  );

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await productService.getAllProducts();
        if (response.outcome) {
          setProducts(response.data || []);
        } else {
          toast.error(response.message || "Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Error fetching products");
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch variants for selected product
  useEffect(() => {
    const fetchVariants = async () => {
      if (!selectedProductId) {
        setVariants([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await variantService.getProductVariants(selectedProductId);
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

    fetchVariants();
  }, [selectedProductId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId) {
      toast.error("Please select a product first");
      return;
    }
    
    try {
      // Get the selected product to generate SKU
      const selectedProduct = products.find(p => p._id === selectedProductId);
      
      if (!selectedProduct) {
        toast.error("Selected product not found");
        return;
      }
      
      // Generate SKU based on product name and size
      const generatedSku = `${selectedProduct.productSlug}-${formData.size}`.toUpperCase();
      
      if (editingVariant) {
        // Update existing variant - always include SKU to satisfy backend validation
        const updateData: UpdateVariantData = {
          size: formData.size,
          sku: editingVariant.sku, // Always include existing SKU
          quantity: formData.quantity,
          // Only update isActive if we have the information, otherwise keep existing
          isActive: editingVariant.isActive,
        };
        
        // If size has changed, we need to update the SKU as well
        if (editingVariant.size !== formData.size) {
          updateData.sku = generatedSku; // Use newly generated SKU
        }
        
        const response = await variantService.updateProductVariant(
          selectedProductId, 
          editingVariant._id!, 
          updateData
        );
        
        if (response.outcome) {
          toast.success(response.message || "Variant updated successfully");
          // The response.data contains the full product object, so we need to extract the updated variant
          if (response.data && response.data.variants) {
            // Find the updated variant in the returned product
            const updatedVariant = response.data.variants.find((v: ProductVariant) => v._id === editingVariant._id);
            if (updatedVariant) {
              setVariants(prev => prev.map(v => v._id === editingVariant._id ? updatedVariant : v));
            }
          } else {
            // Fallback: update using the form data
            setVariants(prev => prev.map(v => v._id === editingVariant._id ? { ...v, ...updateData } : v));
          }
          setEditingVariant(null);
          setShowAddForm(false);
          setFormData({ size: "", quantity: 0 });
        } else {
          toast.error(response.message || "Failed to update variant");
        }
      } else {
        // Add new variant
        const addData: AddVariantData = {
          size: formData.size,
          sku: generatedSku, // Use generated SKU
          quantity: formData.quantity,
        };
        
        const response = await variantService.addVariantToProduct(selectedProductId, addData);
        
        if (response.outcome && response.data) {
          toast.success(response.message || "Variant added successfully");
          setVariants(prev => [...prev, response.data]);
          setShowAddForm(false);
          setFormData({ size: "", quantity: 0 });
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
      quantity: variant.quantity
    });
    setShowAddForm(true);
  };



  const handleToggleStatus = async (variantId: string) => {
    if (!selectedProductId) {
      toast.error("Please select a product first");
      return;
    }
    
    try {
      const response = await variantService.toggleProductVariantStatus(selectedProductId, variantId);
      
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

  // Wrapper function for ReusableTable toggle status
  const handleToggleStatusForTable = async (item: ProductVariant, newValue: boolean) => {
    if (item._id) {
      await handleToggleStatus(item._id);
    }
  };

  const handleCancel = () => {
    setEditingVariant(null);
    setShowAddForm(false);
    setFormData({ size: "", quantity: 0 });
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    setSelectedProductId(productId || null);
  };

  if (productsLoading) {
    return <div className="flex justify-center items-center h-64">Loading products...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Variant Management</h1>
      </div>

      {/* Product Selection */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 ">
        <div className="mb-4 w-[fit-content]">
          <label className="block text-sm font-medium mb-2">Select Product</label>
          <select
            value={selectedProductId || ""}
            onChange={handleProductChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={productsLoading}
          >
            <option value="">-- Select a Product --</option>
            {products.map(product => (
              <option key={product._id} value={product._id}>
                {product.productName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedProductId && (
        <>
          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingVariant ? "Edit Variant" : "Add New Variant"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                      <option value="kg">kg</option>
                      <option value="l">l</option>
                      <option value="unit">unit</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">SKU will be auto-generated based on product and size</p>
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

          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Variants for {products.find(p => p._id === selectedProductId)?.productName}</h2>
              <p className="text-sm text-gray-600 mt-1">Product SKU: {products.find(p => p._id === selectedProductId)?.sku}</p>
            </div>
            <button
              onClick={() => {
                setEditingVariant(null);
                setFormData({ size: "", quantity: 0 });
                setShowAddForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              {showAddForm ? "Cancel" : "Add Variant"}
            </button>
          </div>

          {/* Variants List */}
          <div className="rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-6 text-center">Loading variants...</div>
            ) : (
              <ReusableTable
                columns={extendedColumns}
                data={variants}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatusForTable}
                showActions={true}
                isLoading={loading}
              />
            )}
          </div>
        </>
      )}

      {!selectedProductId && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Please select a product to manage its variants.</p>
        </div>
      )}
    </div>
  );
}