export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  images?: string[];
}

export interface UpdateProductArgs {
  id: string;
  formData: FormData;
}
