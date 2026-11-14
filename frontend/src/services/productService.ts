import API from "./api";
import type { Product } from "../types/Product";

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await API.get("/products");

  return response.data.data;
};


export interface ProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  imageUrl: string;
  isActive: boolean;
}

export const createProduct = async (product: ProductInput) => {
  const response = await API.post("/products", product);
  return response.data.data;
};

export const updateProduct = async (
  productId: string,
  product: ProductInput
) => {
  const response = await API.put(`/products/${productId}`, product);
  return response.data.data;
};

export const deleteProduct = async (productId: string) => {
  const response = await API.delete(`/products/${productId}`);
  return response.data;
};
