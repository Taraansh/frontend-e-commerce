import Api from "./api";

export const Product = {
  createProduct: async (product) => await Api.post("/products", product),
  updateProduct: async (id, product) =>
    await Api.patch("/products/" + id, product),
  deleteProduct: async (id) => await Api.del("/products/" + id),
  getProducts: async () => await Api.get("/products"),
  uploadProductImage: async (id, formData) =>
    await Api.post("/products/" + id + "/image", formData),
  // add sku details for an product
  addSku: async (productId, sku) =>
    await Api.post("/products/" + productId + "/skus", sku),
  // update sku details for an product
  updateSku: async (productId, skuId, sku) =>
    await Api.put("/products/" + productId + "/skus/" + skuId, sku),
  // delete sku details for an product
  deleteSku: async (productId, skuId) => {
    const deleteSkuRes = await Api.del(
      "/products/" + productId + "/skus/" + skuId
    );
    return deleteSkuRes;
  },
  // get all licenses for a product SKU
  getLicenses: async (productId, skuId) =>
    await Api.get("/products/" + productId + "/skus/" + skuId + "/licenses"),
  // add license for a product SKU
  addLicense: async (productId, skuId, license) =>
    await Api.post(
      "/products/" + productId + "/skus/" + skuId + "/licenses",
      license
    ),
  // update license for a product SKU
  updateLicense: async (productId, skuId, licenseId, license) =>
    await Api.put(
      "/products/" + productId + "/skus/" + skuId + "/licenses/" + licenseId,
      license
    ),
  // delete license for a product SKU
  deleteLicense: async (licenseId) =>
    Api.del("/products/licenses/" + licenseId),
  // add review for an product
  addReview: async (productId, review) =>
    await Api.post("/products/" + productId + "/reviews/", review),
  // delete product review
  deleteReview: async (productId, reviewId) =>
    Api.del("/products/" + productId + "/reviews/" + reviewId),
};
