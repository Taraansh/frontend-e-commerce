import Api from "./api";

export const Orders = {
  checkoutSession: async (cartItems) =>
    await Api.post("/orders/checkout", { checkoutDetails: cartItems }),

  fetchAll: async () => await Api.get(`/orders`),

  getOrder: async (orderId) => await Api.get(`/orders/${orderId}`),
};
