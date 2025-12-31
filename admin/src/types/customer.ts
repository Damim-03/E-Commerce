// customer.ts

export interface Address {
  _id?: string;
  label?: string;
  fullName?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  isDefault?: boolean;
}

export interface Customer {
  _id: string;

  name: string;
  email: string;
  imageUrl?: string;

  addresses?: Address[];
  wishlist?: string[];

  createdAt: string;
}
