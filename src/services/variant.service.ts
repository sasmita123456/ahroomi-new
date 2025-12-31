import { StandardResponse } from "../types/api.types";
import apiClient from "../config/axios.config";
import { encryptPayloadAll } from "../utils/encryption";

export interface ProductVariant {
  _id?: string;
  size: string;
  sku: string;
  quantity: number;
  isActive: boolean;
}

export interface AddVariantData {
  size: string;
  sku: string;
  quantity: number;
}

export interface UpdateVariantData {
  size?: string;
  sku?: string;
  quantity?: number;
  isActive?: boolean;
}

export const variantService = {
  // Add a new variant to a product
  addVariantToProduct: async (productId: string, variantData: AddVariantData): Promise<StandardResponse<any>> => {
    // Encrypt the variant data before sending
    const encryptedPayload = await encryptPayloadAll(variantData);
    
    if (encryptedPayload) {
      const response = await apiClient.post<StandardResponse<any>>(`/product/${productId}/variants`, encryptedPayload);
      return response.data;
    } else {
      // Fallback to non-encrypted if encryption fails
      const response = await apiClient.post<StandardResponse<any>>(`/product/${productId}/variants`, variantData);
      return response.data;
    }
  },

  // Get all variants for a product
  getProductVariants: async (productId: string): Promise<StandardResponse<ProductVariant[]>> => {
    const response = await apiClient.get<StandardResponse<ProductVariant[]>>(`/product/${productId}/variants`);
    return response.data;
  },

  // Update a specific variant
  updateProductVariant: async (productId: string, variantId: string, variantData: UpdateVariantData): Promise<StandardResponse<any>> => {
    // Encrypt the variant data before sending
    const encryptedPayload = await encryptPayloadAll(variantData);
    
    if (encryptedPayload) {
      const response = await apiClient.put<StandardResponse<any>>(`/product/${productId}/variants/${variantId}`, encryptedPayload);
      return response.data;
    } else {
      // Fallback to non-encrypted if encryption fails
      const response = await apiClient.put<StandardResponse<any>>(`/product/${productId}/variants/${variantId}`, variantData);
      return response.data;
    }
  },

  // Toggle variant active status
  toggleProductVariantStatus: async (productId: string, variantId: string): Promise<StandardResponse<ProductVariant>> => {
    const response = await apiClient.patch<StandardResponse<ProductVariant>>(`/product/${productId}/variants/${variantId}/toggle-status`);
    return response.data;
  },

  // Delete a specific variant
  deleteProductVariant: async (productId: string, variantId: string): Promise<StandardResponse> => {
    const response = await apiClient.delete<StandardResponse>(`/product/${productId}/variants/${variantId}`);
    return response.data;
  },
};