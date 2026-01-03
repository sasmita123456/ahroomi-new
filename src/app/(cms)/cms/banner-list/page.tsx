// BannerListPage component
"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ReusableTable } from "@/components/Table";
import { BannerService } from "@/services/banner.service";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function BannerListPage() {
  type Banner = {
    _id: string;
    image: string;
    altText: string;
    link?: string;
    position: number;
    status: "active" | "inactive";
    createdAt: string;
    updatedAt: string;
    isActive?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
  };

  const router = useRouter();
  const queryClient = useQueryClient();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["banners", pageIndex, pageSize, searchTerm],
    queryFn: async () => {
      const res = await BannerService.list();

      // The API returns an array directly, not an object with a banners property
      let banners = res.data || [];

      // Transform the data to match what the component expects
      banners = banners.map((b: any) => ({
        ...b,
        // Flatten SEO fields if they're nested
        seoTitle: b.seo?.title || b.seoTitle || "",
        seoDescription: b.seo?.description || b.seoDescription || "",
        seoKeywords: b.seo?.keywords || b.seoKeywords || "",
        // Add isActive field for status toggle
        isActive: b.status === "active",
      }));

      if (searchTerm) {
        banners = banners.filter((b: any) =>
          b.altText?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      const totalCount = banners.length;
      const pageCount = Math.ceil(totalCount / pageSize);
      const paginated = banners.slice(
        pageIndex * pageSize,
        pageIndex * pageSize + pageSize
      );

      return {
        banners: paginated,
        totalCount,
        pageCount,
      };
    },
  });

  const handleToggleStatus = async (banner: Banner, newValue: boolean) => {
    try {
      await BannerService.toggleStatus(banner._id);
      toast.success(`Banner ${newValue ? "activated" : "deactivated"}`);
      queryClient.invalidateQueries({
        queryKey: ["banners"],
        exact: false,
      });
    } catch {
      toast.error("Failed to update banner status");
    }
  };

  const handleEdit = (banner: Banner) => {
    router.push(`/cms/banner-edit/${banner._id}`);
  };

  const columns = [
    {
      header: "Banner Image",
      accessorKey: "image",
      cell: ({ row }: any) => (
        <img
          src={
            row.original.image
              ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/banners/${row.original.image}`
              : "/no-image.png"
          }
          className="w-28 h-12 object-cover rounded border border-[#93b5b9]"
          alt={row.original.altText}
        />
      ),
    },
    {
      header: "Alt Text",
      accessorKey: "altText",
      cell: ({ getValue }: any) => (
        <div className="truncate w-40" title={getValue()}>
          {getValue()}
        </div>
      ),
    },
    {
      header: "Position",
      accessorKey: "position",
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: ({ getValue }: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            getValue()
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {getValue() ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ getValue }: any) => new Date(getValue()).toLocaleDateString(),
    },
  ];

  return (
    <section className="bg-white rounded-lg p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Banner List</h2>

        <div className="flex gap-2">
          <Link
            href="/cms/banner-add"
            className="flex items-center gap-1 bg-[#056d6e] text-white text-sm px-3 py-2 rounded-full hover:bg-[#04535c]"
          >
            <FiPlus /> Add Banner
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-[#c5dcdc] rounded-lg p-4">
        <ReusableTable<Banner>
          columns={columns}
          data={data?.banners || []}
          isLoading={isLoading}
          totalCount={data?.totalCount || 0}
          pageCount={data?.pageCount || 0}
          searchable
          sortable={false}
          showActions
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          fetchData={({ pageIndex, pageSize, search }) => {
            setPageIndex(pageIndex);
            setPageSize(pageSize);
            if (search !== undefined) {
              setSearchTerm(search);
              setPageIndex(0);
            }
          }}
        />
      </div>
    </section>
  );
}
