export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}