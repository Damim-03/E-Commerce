import type { UpdateProductArgs } from "../../types/product";
import axiosInstance from "../axios/axios";

export const productApi = {
  getAllProducts: async () => {
    const { data } = await axiosInstance.get("/admin/products");
    return data;
  },

  createProduct: async (formData: FormData) => {
    const { data } = await axiosInstance.post("/admin/products", formData);
    return data;
  },

  updateProduct: async ({ id, formData }: UpdateProductArgs) => {
    const { data } = await axiosInstance.put(`/admin/products/${id}`, formData);
    return data;
  },

  deleteProduct: async (productId: string) => {
    const { data } = await axiosInstance.delete(`/admin/products/${productId}`);
    return data;
  },
};

export const orderApi = {
  getAllOrders: async () => {
    const { data } = await axiosInstance.get("/admin/orders");
    return data;
  },

  updateStatus: async (orderId: string, status: string) => {
    const { data } = await axiosInstance.patch(
      `/admin/orders/${orderId}/status`,
      { status }
    );
    return data;
  },
};

export const statsApi = {
  getDashboardStats: async () => {
    const { data } = await axiosInstance.get("/admin/stats");
    return data;
  },
};

export const customerApi = {
  getAllCustomers: async () => {
    const { data } = await axiosInstance.get("/admin/customers");
    return data;
  },
};
