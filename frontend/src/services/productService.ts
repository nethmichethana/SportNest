import API from "./api";
import type { Product } from "../types/Product";

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await API.get("/products");

  return response.data.data;
};