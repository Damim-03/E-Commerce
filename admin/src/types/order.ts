export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  product: string;
}

export interface ShippingAddress {
  fullName: string;
  city: string;
  state: string;
  address?: string;
  postalCode?: string;
  country?: string;
}

export interface Order {
  _id: string;
  status: "pending" | "shipped" | "delivered";
  totalPrice: number;
  createdAt: string;

  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
}
