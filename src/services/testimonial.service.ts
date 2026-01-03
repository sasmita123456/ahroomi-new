// services/testimonial.service.ts
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL; 

export interface Testimonial {
  _id: string;
  customerName: string;
  customerImage: string;
  rating: number;
  review: string;
  date: string;
  status: "active" | "inactive";
  position: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  // Keep flat fields for frontend compatibility
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

export const TestimonialService = {
  create: (data: FormData) => axios.post(`${API}/testimonial`, data),
  list: () => axios.get<Testimonial[]>(`${API}/testimonial`),
  getById: (id: string) => axios.get<Testimonial>(`${API}/testimonial/${id}`),
  update: (id: string, data: FormData) => axios.put<Testimonial>(`${API}/testimonial/${id}`, data),
  delete: (id: string) => axios.delete(`${API}/testimonial/${id}`),
  toggleStatus: (id: string) => axios.patch<Testimonial>(`${API}/testimonial/${id}/status`),
  
  // Get only active testimonials for frontend display
  getActiveTestimonials: async (): Promise<Testimonial[]> => {
    try {
      const response = await TestimonialService.list();
      return response.data
        .filter(testimonial => testimonial.status === 'active')
        .sort((a, b) => a.position - b.position);
    } catch (error) {
      console.error("Error fetching active testimonials:", error);
      throw error;
    }
  }
};