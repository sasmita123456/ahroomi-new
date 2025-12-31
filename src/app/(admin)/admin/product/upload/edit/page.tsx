"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSave, FiX, FiUpload, FiImage, FiPlus, FiTrash2 } from "react-icons/fi";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { productService, ProductResponse } from "@/services/product.service";

interface EditImageData {
  thumbnail?: File | string;
  longImages: Array<{file?: File, url?: string, isNew: boolean, replaceIndex?: number}>;
  alt: string;
  title: string;
}

interface ProductImage {
  thumbnail?: string;
  longImage?: string;
  alt: string;
  title: string;
  _id?: string;
}

export default function ProductImageEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const productId = searchParams.get('productId');
  
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [editData, setEditData] = useState<EditImageData>({
    thumbnail: undefined,
    longImages: [],
    alt: "",
    title: ""
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageAltTitleMap, setImageAltTitleMap] = useState<Record<number, { alt: string, title: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Function to handle image selection and update alt/title fields
  const handleImageSelect = (index: number, imageType: 'thumbnail' | 'longImage') => {
    if (!product?.images) return;
    
    setSelectedImageIndex(index);
    
    const image = product.images[index];
    if (image) {
      // Update the imageAltTitleMap with the current image's alt and title
      setImageAltTitleMap(prev => ({
        ...prev,
        [index]: {
          alt: image.alt || "",
          title: image.title || ""
        }
      }));
      
      // Update the edit data with the selected image's alt and title
      setEditData(prev => ({
        ...prev,
        alt: image.alt || "",
        title: image.title || ""
      }));
    }
  };

  // Fetch product data on component mount
  useEffect(() => {
    if (!productId) {
      toast.error("Missing product ID");
      router.push('/admin/product/upload/list');
      return;
    }
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(productId);
        if (response && response.outcome === true && response.data) {
          setProduct(response.data);
          
          // Initialize edit data with existing images
          const productImages = response.data.images || [];
          
          // Find the first thumbnail image to initialize
          const firstThumbnail = response.data.images?.find(img => img.thumbnail);
          
          setEditData({
            thumbnail: firstThumbnail?.thumbnail,
            longImages: response.data.images?.filter(img => img.longImage).map((img, index) => ({
              url: img.longImage,
              isNew: false,
              replaceIndex: index // Track the original index for replacement
            })) || [],
            alt: firstThumbnail?.alt || "", // Initialize with first image's alt if available
            title: firstThumbnail?.title || "" // Initialize with first image's title if available
          });
        } else {
          toast.error(response?.message || "Failed to fetch product");
          router.push('/admin/product/upload/list');
        }
      } catch (error: any) {
        console.error("Error fetching product:", error);
        toast.error(error.message || "Failed to fetch product");
        router.push('/admin/product/upload/list');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditData({...editData, thumbnail: e.target.files[0]});
    }
  };

  const handleLongImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newLongImages = files.map(file => ({
        file: file,
        isNew: true
      }));
      
      setEditData({
        ...editData, 
        longImages: [...editData.longImages, ...newLongImages]
      });
    }
  };

  const handleDeleteThumbnail = async () => {
    if (editData.thumbnail && typeof editData.thumbnail === 'string') {
      // Find the index of this thumbnail in the product's images array
      if (product?.images) {
        const imageIndexInProduct = product.images.findIndex(img => img.thumbnail === editData.thumbnail);
        
        if (imageIndexInProduct !== -1) {
          try {
            await productService.deleteProductImage(productId!, imageIndexInProduct);
            // Refresh the product data after deletion
            const response = await productService.getProductById(productId!);
            if (response && response.outcome === true && response.data) {
              setProduct(response.data);
              // Update editData to remove the thumbnail
              setEditData({...editData, thumbnail: undefined});
              toast.success("Thumbnail deleted successfully!");
            }
          } catch (error) {
            console.error("Error deleting thumbnail:", error);
            toast.error("Failed to delete thumbnail");
          }
          return;
        }
      }
    }
    
    // For fallback, just remove from local state
    setEditData({...editData, thumbnail: undefined});
  };

  const removeLongImage = async (index: number) => {
    // If this is an existing image (not a new one), call the API to delete it from the server
    if (!editData.longImages[index].isNew && editData.longImages[index].url) {
      // Find the index of this image in the product's images array
      if (product?.images) {
        const imageInProduct = product.images.find(img => img.longImage === editData.longImages[index].url);
        const imageIndexInProduct = product.images.indexOf(imageInProduct!);
        
        if (imageIndexInProduct !== -1) {
          try {
            await productService.deleteProductImage(productId!, imageIndexInProduct);
            // Refresh the product data after deletion
            const response = await productService.getProductById(productId!);
            if (response && response.outcome === true && response.data) {
              setProduct(response.data);
              // Update editData to reflect the deletion
              const updatedLongImages = [...editData.longImages];
              updatedLongImages.splice(index, 1);
              setEditData({...editData, longImages: updatedLongImages});
              toast.success("Image deleted successfully!");
            }
          } catch (error) {
            console.error("Error deleting image:", error);
            toast.error("Failed to delete image");
          }
          return; // Return early since API call is handled
        }
      }
    }
    
    // For new images or if API call fails, just remove from local state
    const newLongImages = [...editData.longImages];
    newLongImages.splice(index, 1);
    setEditData({...editData, longImages: newLongImages});
  };

  const handleSave = async () => {
    if (!productId) return;
    
    try {
      setSaving(true);
      
      // Prepare form data
      const formData = new FormData();
      
      // Add thumbnail if present and it's a new file
      if (editData.thumbnail && editData.thumbnail instanceof File) {
        formData.append('thumbnail', editData.thumbnail);
        formData.append('thumbnail_alt', editData.alt);
        formData.append('thumbnail_title', editData.title);
        
        // If we have a selected image that's a thumbnail, send the index for replacement
        if (selectedImageIndex !== null && product?.images && product.images[selectedImageIndex]?.thumbnail) {
          formData.append('replaceThumbnailIndex', selectedImageIndex.toString());
        }
      }
      
      // Handle long images - send each new file with its replacement index
      editData.longImages.forEach((imgObj, imgIndex) => {
        if (imgObj.isNew && imgObj.file) {
          formData.append('longImage', imgObj.file);
          // If this is replacing an existing image, send the replace index
          if (imgObj.replaceIndex !== undefined) {
            formData.append('replaceLongImageIndex', imgObj.replaceIndex.toString());
          } else {
            // If we're uploading a new long image but have a selected image that's a long image,
            // use that index for replacement
            if (selectedImageIndex !== null && product?.images && product.images[selectedImageIndex]?.longImage) {
              formData.append('replaceLongImageIndex', selectedImageIndex.toString());
            }
          }
        }
      });
      
      // Add alt and title for long images if there are new ones
      if (editData.longImages.some(img => img.isNew && img.file)) {
        formData.append('longImage_alt', editData.alt);
        formData.append('longImage_title', editData.title);
      }
      
      // Update existing image alt and title values
      if (product?.images && product.images.length > 0) {
        const existingImagesUpdates = product.images.map((img, index) => ({
          index: index,
          alt: img.alt,
          title: img.title
        }));
        
        // Update alt and title for each image based on the imageAltTitleMap
        for (let i = 0; i < existingImagesUpdates.length; i++) {
          if (imageAltTitleMap[i]) {
            existingImagesUpdates[i].alt = imageAltTitleMap[i].alt;
            existingImagesUpdates[i].title = imageAltTitleMap[i].title;
          }
        }
        
        formData.append('existingImages', JSON.stringify(existingImagesUpdates));
      }
      
      const response = await productService.updateProduct(productId, formData);
      
      if (response && response.outcome === true) {
        toast.success("Images updated successfully!");
        router.push('/admin/product/upload/list');
      } else {
        toast.error(response?.message || "Failed to update images");
      }
    } catch (error: any) {
      console.error("Error updating images:", error);
      toast.error(error.message || "An error occurred while updating the images");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/product/upload/list');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/admin/product/upload/list" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <FiArrowLeft className="mr-2" />
          Back to Image List
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product Images</h1>
        <p className="text-gray-600 mt-2">
          Product: {product?.productName} | SKU: {product?.sku}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Images Preview */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Current Images</h2>
            
            {/* Thumbnail Preview */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Thumbnail</h3>
              <div className="flex justify-center">
                {editData.thumbnail ? (
                  typeof editData.thumbnail === 'string' ? (
                    <div className="relative">
                      <img 
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${editData.thumbnail}`} 
                        alt="Thumbnail" 
                        className={`max-w-full h-auto max-h-48 object-contain rounded border cursor-pointer ${selectedImageIndex === product?.images?.findIndex(img => img.thumbnail === editData.thumbnail) ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => {
                          // Find the index of this specific thumbnail in the product images array
                          const thumbnailIndex = product?.images?.findIndex(img => img.thumbnail === editData.thumbnail);
                          if (thumbnailIndex !== undefined && thumbnailIndex !== -1) {
                            handleImageSelect(thumbnailIndex, 'thumbnail');
                          }
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.png';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <label className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer text-xs">
                          Replace
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                // Find the index of the current thumbnail in the product images
                                const thumbnailIndex = product?.images?.findIndex(img => img.thumbnail === (typeof editData.thumbnail === 'string' ? editData.thumbnail : undefined));
                                setEditData({...editData, thumbnail: e.target.files[0]});
                                
                                // Set the selected image index to the thumbnail index for proper replacement
                                if (thumbnailIndex !== undefined && thumbnailIndex !== -1) {
                                  setSelectedImageIndex(thumbnailIndex);
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={URL.createObjectURL(editData.thumbnail)} 
                      alt="New thumbnail" 
                      className="max-w-full h-auto max-h-48 object-contain rounded border"
                    />
                  )
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 flex items-center justify-center">
                    <FiImage className="text-gray-500 text-2xl" />
                  </div>
                )}
              </div>
              
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Replace Thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                
                {editData.thumbnail && typeof editData.thumbnail === 'string' && (
                  <button
                    type="button"
                    onClick={handleDeleteThumbnail}
                    className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FiTrash2 className="-ml-1 mr-2 h-4 w-4" />
                    Delete Thumbnail
                  </button>
                )}
              </div>
            </div>
            
            {/* Long Images Preview */}
            <div>
              <h3 className="text-md font-medium mb-2">Long Images ({editData.longImages.length})</h3>
              <div className="grid grid-cols-2 gap-2">
                {editData.longImages.map((imgObj, index) => (
                  <div key={index} className="relative">
                    {imgObj.isNew && imgObj.file ? (
                      <div className="relative">
                        <img 
                          src={URL.createObjectURL(imgObj.file)} 
                          alt={`New long image ${index + 1}`} 
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeLongImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          title="Remove image"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    ) : imgObj.url ? (
                      <div className="relative">
                        <img 
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${imgObj.url}`} 
                          alt={`Long image ${index + 1}`} 
                          className={`w-full h-24 object-cover rounded border cursor-pointer ${selectedImageIndex === (product?.images?.findIndex(img => img.longImage === imgObj.url)) ? 'ring-2 ring-blue-500' : ''}`}
                          onClick={() => {
                            // Find the index of this specific long image in the product images array
                            const longImageIndex = product?.images?.findIndex(img => img.longImage === imgObj.url);
                            if (longImageIndex !== undefined && longImageIndex !== -1) {
                              handleImageSelect(longImageIndex, 'longImage');
                            }
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.png';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <label className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer text-xs">
                            Replace
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const newLongImages = [...editData.longImages];
                                  newLongImages[index] = {
                                    file: e.target.files[0],
                                    isNew: true,
                                    replaceIndex: imgObj.replaceIndex
                                  };
                                  setEditData({...editData, longImages: newLongImages});
                                  
                                  // Find the index of the current long image in the product images
                                  const longImageIndex = product?.images?.findIndex(img => img.longImage === imgObj.url);
                                  
                                  // Set the selected image index to the long image index for proper replacement
                                  if (longImageIndex !== undefined && longImageIndex !== -1) {
                                    setSelectedImageIndex(longImageIndex);
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLongImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          title="Delete image"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-24 bg-gray-200 rounded border flex items-center justify-center">
                        <FiImage className="text-gray-500" />
                      </div>
                    )}
                  </div>
                ))}

                {editData.longImages.length === 0 && (
                  <div className="col-span-2 text-center py-4 text-gray-500">
                    No long images uploaded
                  </div>
                )}
              </div>
              
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add More Long Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleLongImagesChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Image Details</h2>
            
            <div className="space-y-4">
              
              {/* Thumbnail-specific alt and title fields */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                {/* <h3 className="text-md font-medium text-gray-700 mb-2">Thumbnail Image Details</h3> */}
                <div className="space-y-3">
                  <div>
                    <label htmlFor="thumbnail-alt" className="block text-sm font-medium text-gray-700 mb-1">
                      Thumbnail Alt Text
                    </label>
                    <input
                      type="text"
                      id="thumbnail-alt"
                      value={(() => {
                        // Get the thumbnail image if exists
                        if (product?.images && editData.thumbnail && typeof editData.thumbnail === 'string') {
                          const thumbnailImage = product.images.find(img => img.thumbnail === editData.thumbnail);
                          const thumbnailIndex = product.images.indexOf(thumbnailImage!);
                          return imageAltTitleMap[thumbnailIndex]?.alt || thumbnailImage?.alt || '';
                        }
                        return '';
                      })()}
                      onChange={(e) => {
                        // Find the thumbnail image and update its alt
                        if (product?.images && editData.thumbnail && typeof editData.thumbnail === 'string') {
                          const thumbnailImage = product.images.find(img => img.thumbnail === editData.thumbnail);
                          const thumbnailIndex = product.images.indexOf(thumbnailImage!);
                          
                          if (thumbnailIndex !== -1) {
                            setImageAltTitleMap(prev => ({
                              ...prev,
                              [thumbnailIndex]: {
                                alt: e.target.value,
                                title: prev[thumbnailIndex]?.title || imageAltTitleMap[thumbnailIndex]?.title || thumbnailImage?.title || ''
                              }
                            }));
                          }
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter thumbnail alt text"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="thumbnail-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Thumbnail Title
                    </label>
                    <input
                      type="text"
                      id="thumbnail-title"
                      value={(() => {
                        // Get the thumbnail image if exists
                        if (product?.images && editData.thumbnail && typeof editData.thumbnail === 'string') {
                          const thumbnailImage = product.images.find(img => img.thumbnail === editData.thumbnail);
                          const thumbnailIndex = product.images.indexOf(thumbnailImage!);
                          return imageAltTitleMap[thumbnailIndex]?.title || thumbnailImage?.title || '';
                        }
                        return '';
                      })()}
                      onChange={(e) => {
                        // Find the thumbnail image and update its title
                        if (product?.images && editData.thumbnail && typeof editData.thumbnail === 'string') {
                          const thumbnailImage = product.images.find(img => img.thumbnail === editData.thumbnail);
                          const thumbnailIndex = product.images.indexOf(thumbnailImage!);
                          
                          if (thumbnailIndex !== -1) {
                            setImageAltTitleMap(prev => ({
                              ...prev,
                              [thumbnailIndex]: {
                                alt: prev[thumbnailIndex]?.alt || imageAltTitleMap[thumbnailIndex]?.alt || thumbnailImage?.alt || '',
                                title: e.target.value
                              }
                            }));
                          }
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter thumbnail title"
                    />
                  </div>
                </div>
              </div>
              
              {/* Long image-specific alt and title fields */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                {/* <h3 className="text-md font-medium text-gray-700 mb-2">Long Image Details</h3> */}
                <div className="space-y-3">
                  <div>
                    <label htmlFor="longimage-alt" className="block text-sm font-medium text-gray-700 mb-1">
                      Long Image Alt Text
                    </label>
                    <input
                      type="text"
                      id="longimage-alt"
                      value={(() => {
                        // Get the first long image if exists
                        if (product?.images && editData.longImages && editData.longImages.length > 0) {
                          // For now, we'll use the first long image for display
                          const firstLongImage = product.images.find(img => img.longImage);
                          const firstLongImageIndex = product.images.indexOf(firstLongImage!);
                          return imageAltTitleMap[firstLongImageIndex]?.alt || firstLongImage?.alt || '';
                        }
                        return '';
                      })()}
                      onChange={(e) => {
                        // Find the first long image and update its alt
                        if (product?.images) {
                          const firstLongImage = product.images.find(img => img.longImage);
                          const firstLongImageIndex = product.images.indexOf(firstLongImage!);
                          
                          if (firstLongImageIndex !== -1) {
                            setImageAltTitleMap(prev => ({
                              ...prev,
                              [firstLongImageIndex]: {
                                alt: e.target.value,
                                title: prev[firstLongImageIndex]?.title || imageAltTitleMap[firstLongImageIndex]?.title || firstLongImage?.title || ''
                              }
                            }));
                          }
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter long image alt text"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="longimage-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Long Image Title
                    </label>
                    <input
                      type="text"
                      id="longimage-title"
                      value={(() => {
                        // Get the first long image if exists
                        if (product?.images && editData.longImages && editData.longImages.length > 0) {
                          const firstLongImage = product.images.find(img => img.longImage);
                          const firstLongImageIndex = product.images.indexOf(firstLongImage!);
                          return imageAltTitleMap[firstLongImageIndex]?.title || firstLongImage?.title || '';
                        }
                        return '';
                      })()}
                      onChange={(e) => {
                        // Find the first long image and update its title
                        if (product?.images) {
                          const firstLongImage = product.images.find(img => img.longImage);
                          const firstLongImageIndex = product.images.indexOf(firstLongImage!);
                          
                          if (firstLongImageIndex !== -1) {
                            setImageAltTitleMap(prev => ({
                              ...prev,
                              [firstLongImageIndex]: {
                                alt: prev[firstLongImageIndex]?.alt || imageAltTitleMap[firstLongImageIndex]?.alt || firstLongImage?.alt || '',
                                title: e.target.value
                              }
                            }));
                          }
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter long image title"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-6">
                <h3 className="text-sm font-medium text-blue-800 mb-1">Note</h3>
                <p className="text-xs text-blue-700">
                  You can replace the thumbnail, add or remove long images, 
                  and update alt/text for specific images using the fields above.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="-ml-1 mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}