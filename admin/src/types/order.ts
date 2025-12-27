import type { Key } from "react";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  product: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: Key | null | undefined;
  _id: string;
  status: "pending" | "shipped" | "delivered";
  totalPrice: number;
  createdAt: string;

  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
}
