"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ReusableTable } from "@/components/Table";
import { TestimonialService, Testimonial } from "@/services/testimonial.service";
import { FiPlus, FiStar, FiUser, FiTrash2, FiEdit } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function TestimonialListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["testimonials", pageIndex, pageSize, searchTerm],
    queryFn: async () => {
      const res = await TestimonialService.list();
      let testimonials = res.data || [];

      testimonials = testimonials.map((t: Testimonial) => ({
        ...t,
        isActive: t.status === "active",
      }));

      if (searchTerm) {
        testimonials = testimonials.filter((t: Testimonial) =>
          t.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.review?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      const totalCount = testimonials.length;
      const pageCount = Math.ceil(totalCount / pageSize);
      const paginated = testimonials.slice(
        pageIndex * pageSize,
        pageIndex * pageSize + pageSize
      );

      return {
        testimonials: paginated,
        totalCount,
        pageCount,
      };
    },
  });

  const handleToggleStatus = async (testimonial: Testimonial, newValue: boolean) => {
    try {
      await TestimonialService.toggleStatus(testimonial._id);
      toast.success(`Testimonial ${newValue ? "activated" : "deactivated"}`);
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    } catch {
      toast.error("Failed to update testimonial status");
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    router.push(`/cms/testimonial-edit/${testimonial._id}`);
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (window.confirm(`Are you sure you want to delete this testimonial from ${testimonial.customerName}?`)) {
      try {
        await TestimonialService.delete(testimonial._id);
        toast.success("Testimonial deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      } catch {
        toast.error("Failed to delete testimonial");
      }
    }
  };

  // Function to render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const columns = [
    {
      header: "Customer",
      accessorKey: "customerName",
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <div className="h-10 w-10 shrink-0">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/testimonials/${row.original.customerImage}`}
              alt={row.original.customerName}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{row.original.customerName}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Rating",
      accessorKey: "rating",
      cell: ({ getValue }: any) => renderStars(getValue()),
    },
    {
      header: "Review",
      accessorKey: "review",
      cell: ({ getValue }: any) => (
        <div className="truncate w-64" title={getValue()}>
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
      header: "Date",
      accessorKey: "date",
      cell: ({ getValue }: any) => new Date(getValue()).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="text-blue-600 hover:text-blue-900 transition-colors"
            title="Edit"
          >
            <FiEdit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="text-red-600 hover:text-red-900 transition-colors"
            title="Delete"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="bg-white rounded-lg p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Testimonial List</h2>

        <div className="flex gap-2">
          <Link
            href="/cms/testimonial-add"
            className="flex items-center gap-1 bg-[#056d6e] text-white text-sm px-3 py-2 rounded-full hover:bg-[#04535c]"
          >
            <FiPlus /> Add Testimonial
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-[#c5dcdc] rounded-lg p-4">
        <ReusableTable<Testimonial>
          columns={columns}
          data={data?.testimonials || []}
          isLoading={isLoading}
          totalCount={data?.totalCount || 0}
          pageCount={data?.pageCount || 0}
          searchable
          sortable={false}
          showActions={false} // Set to false since we're handling actions in the columns
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