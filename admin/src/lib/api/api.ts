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

    updateProduct: async (id: string, formData: FormData) => {
        const { data } = await axiosInstance.put(`/admin/products/${id}`, 
            formData, { headers: { "Content-Type": "multipart/form-data" } 
        });
        return data;
    }
}

export const orderApi = {
    getAllOrders: async () => {
        const { data } = await axiosInstance.get("/admin/orders");
        return data;
    },

    updateStatus: async (orderId: string, status: string) => {
        const { data } = await axiosInstance.patch(`/admin/orders/${orderId}/status`, { status });
        return data;
    }
}

export const statsApi = {
    getDashboardStats: async() => {
        const { data } = await axiosInstance.get("/admin/stats");
        return data;
    }
}