import Api from "./api";

export const User = {
  getUsers: async ()=> await Api.get("/users"),
  createUsers: async (user) =>
    await Api.post("/users", user),
  updateUser: async (
    id,
    user
  ) => await Api.patch("/users/update-name-password/" + id, user),
  loginUser: async (user) =>
    await Api.post("/users/login", user),
  logoutUser: async () =>
    await Api.get("/users/logout"),
  forgotPassword: async (email) =>
    await Api.get("/users/forgot-password/" + email),
  resendOtp: async (email) =>
    await Api.get("/users/send-otp-email/" + email),
  verifyOtp: async (otp, email) =>
    await Api.get("/users/verify-email/" + otp + "/" + email),
};
