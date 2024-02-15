"use client";

import React, { useContext } from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { getFormatedStringFromDays } from "../../../utils";
import Link from "next/link";
import { CloudUpload, Pen, Trash } from "react-bootstrap-icons";
import { Rating } from "react-simple-star-rating";
import { toast } from "react-toastify";
import { Product } from "../../../services/Products.service";
// import { useRouter } from "next/navigation";
import { Context } from "../../../context";

const ProductItem = ({ product, userType }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  // const router = useRouter();

  const {
    state: { user },
  } = useContext(Context);
  // console.log(user);

  const deleteProduct = async (productId) => {
    try {
      setIsLoading(true);
      const deleteConfirm = confirm(
        "Want to delete? You will lost all details, skus and licences for this product"
      );
      if (deleteConfirm) {
        const deleteProductRes = await Product.deleteProduct(productId);
        if (!deleteProductRes.success) {
          throw new Error(deleteProductRes.message);
        }
        // router.push("/products/");
        window.location.reload();
        toast.success(deleteProductRes.message);
      }
    } catch (error) {
      if (error.response) {
        if (
          Array.isArray(error.response.data?.message) &&
          Array.isArray(error.response?.data?.message)
        ) {
          return error.response.data.message.forEach((message) => {
            toast.error(message);
          });
        } else {
          return toast.error(message);
        }
      }
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProductImage = async (e, productId) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("productImage", file);
      const uploadProductImageRes = await Product.uploadProductImage(
        productId,
        formData
      );
      if (!uploadProductImageRes.success) {
        throw new Error(uploadProductImageRes.message);
      }
      product.image = uploadProductImageRes.result;
      toast.success(uploadProductImageRes.message);
    } catch (error) {
      if (error.response) {
        if (
          Array.isArray(error.response.data?.message) &&
          Array.isArray(error.response?.data?.message)
        ) {
          return error.response.data.message.forEach((message) => {
            toast.error(message);
          });
        }
        return toast.error(error.response.data.message);
      }
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Card style={{ width: "16rem" }}>
        <Link
          href={`/products/${product?._id}`}
          style={{ textDecoration: "none" }}
        >
          <Card.Img
            variant="top"
            src={
              uploading
                ? "https://www.ebi.ac.uk/training/progressbar.gif"
                : product.image
            }
          />
        </Link>
        <Card.Body>
          <Link
            href={`/products/${product?._id}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Card.Title>{product.productName}</Card.Title>

            <Card.Text style={{ marginBottom: "0" }}>
              <span className="priceText">
                {product?.skuDetails
                  ? product?.skuDetails?.length > 1
                    ? `₹${Math.min.apply(
                        Math,
                        product?.skuDetails.map((sku) => sku.price)
                      )} - ₹${Math.max.apply(
                        Math,
                        product?.skuDetails.map((sku) => sku.price)
                      )}`
                    : `₹${product?.skuDetails?.[0]?.price || "000"}`
                  : "₹000"}{" "}
              </span>
            </Card.Text>
            {product.skuDetails && product.skuDetails.length > 0 ? (
              product.skuDetails
                .sort((a, b) => a.validity - b.validity)
                .map((sku, index) => {
                  return (
                    <Badge
                      key={index}
                      variant="primary"
                      text="dark"
                      className="skuBtn"
                    >
                      {sku.lifetime
                        ? "Lifetime"
                        : getFormatedStringFromDays(sku.validity)}
                    </Badge>
                  );
                })
            ) : (
              <Badge>No Details Yet</Badge>
            )}
            <br />
            {/* <Rating
              name="rate1"
              iconsCount={5}
              readonly
              size={18}
              initialValue={product.avgRating || 0}
            /> */}
          </Link>
          {userType === "admin" && (
            <div className="btnGrpForProduct">
              <div className="file btn btn-md btn-outline-primary fileInputDiv">
                <CloudUpload />
                <input
                  type="file"
                  name="file"
                  className="fileInput"
                  onChange={(e) => {
                    uploadProductImage(e, product._id);
                  }}
                />
              </div>
              <Link
                className="btn btn-outline-dark viewProdBtn"
                href={{
                  pathname: `/products/update-product`,
                  query: { productId: product?._id },
                }}
              >
                <Pen />
              </Link>
              <Button
                variant="outline-dark"
                className="btn btn-outline-dark viewProdBtn"
                onClick={() => deleteProduct(product._id)}
              >
                {isLoading && (
                  <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                <Trash />
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default ProductItem;
