
import API from "./api";
import type { Order } from "../types/Order";

export const getMyOrders = async () => {
  const response = await API.get("/orders/my-orders");

  return response.data.data;
};


export const getAllOrders = async (): Promise<Order[]> => {
  const response = await API.get("/orders");

  return response.data.data;
};
