
import API from "./api";

export const getMyOrders = async () => {
  const response = await API.get("/orders/my-orders");

  return response.data.data;
};
