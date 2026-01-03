// services/banner.service.ts
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL; 

export const BannerService = {
  create: (data: FormData) => axios.post(`${API}/banner`, data),
  list: () => axios.get(`${API}/banner`),
  getById: (id: string) => axios.get(`${API}/banner/${id}`),
  update: (id: string, data: FormData) => axios.put(`${API}/banner/${id}`, data),
  toggleStatus: (id: string) => axios.patch(`${API}/banner/${id}/status`),
};