"use client";

import React from "react";
import { Button, Table, Badge } from "react-bootstrap";
import { getFormatedStringFromDays } from "../../../utils";
import { toast } from "react-toastify";
import { Product } from "../../../services/Products.service";
import SkuDetailsForm from "./SkuDetailsForm";
import { Archive, Pen } from "react-bootstrap-icons";
import SkuDetailsLicense from "./SkuDetailsLicense";

const SkuDetailsList = ({ skuDetails, productId, setAllSkuDetails }) => {
  const [skuDetailsFormShow, setSkuDetailsFormShow] = React.useState(false);
  const [skuIdForUpdate, setSkuIdForUpdate] = React.useState("");
  const [licensesListFor, setLicensesListFor] = React.useState("");
  const [isLoadingForDelete, setIsLoadingForDelete] = React.useState({
    status: false,
    id: "",
  });

  const allSkuDetails = skuDetails;
  // console.log(allSkuDetails);
  // console.log(skuDetails);

  const deleteHandler = async (skuId) => {
    try {
      const deleteConfirm = confirm(
        "Want to delete? You will lose all licenses for this sku."
      );
      if (deleteConfirm) {
        setIsLoadingForDelete({ status: true, id: skuId });
        const deleteSkuRes = await Product.deleteSku(productId, skuId);
        if (!deleteSkuRes.success) {
          throw new Error(deleteSkuRes.message);
        }
        setAllSkuDetails(allSkuDetails.filter((sku) => sku._id !== skuId));
        toast.success(deleteSkuRes.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (Array.isArray(error.response?.data?.message)) {
          return error.response.data.message.forEach((message) => {
            toast.error(message);
          });
        } else {
          return toast.error(error.response.data.message);
        }
      }
      toast.error(error.message);
    } finally {
      setIsLoadingForDelete({ status: false, id: "" });
    }
  };

  return (
    <>
      {!skuDetailsFormShow && !licensesListFor && (
        <>
          <Button
            variant="secondary"
            onClick={() => setSkuDetailsFormShow(true)}
          >
            Add SKU Details
          </Button>
          <Table responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>License Keys</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {allSkuDetails && allSkuDetails.length > 0 ? (
                allSkuDetails.map((skuDetail, key) => (
                  <tr key={key}>
                    <td>{skuDetail?.skuName}</td>
                    <td>
                      ₹{skuDetail?.price}{" "}
                      <Badge bg="warning" text="dark">
                        {skuDetail?.lifetime
                          ? "Lifetime"
                          : getFormatedStringFromDays(skuDetail?.validity)}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="link"
                        onClick={() => {
                          setLicensesListFor(skuDetail?._id);
                          setSkuDetailsFormShow(false);
                        }}
                      >
                        View
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="outline-dark"
                        id={skuDetail._id}
                        onClick={() => {
                          setSkuIdForUpdate(skuDetail._id);
                          setSkuDetailsFormShow(true);
                        }}
                      >
                        <Pen />
                      </Button>{" "}
                      <Button
                        variant="outline-dark"
                        onClick={() => deleteHandler(skuDetail._id)}
                      >
                        {isLoadingForDelete.status &&
                        isLoadingForDelete.id === skuDetail._id ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          <Archive />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No SKU Details found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}

      {skuDetailsFormShow && (
        <SkuDetailsForm
          setSkuDetailsFormShow={setSkuDetailsFormShow}
          setAllSkuDetails={setAllSkuDetails}
          allSkuDetails={skuDetails}
          productId={productId}
          skuIdForUpdate={skuIdForUpdate}
          setSkuIdForUpdate={setSkuIdForUpdate}
        />
      )}

      {licensesListFor && (
        <SkuDetailsLicense
          licensesListFor={licensesListFor}
          setLicensesListFor={setLicensesListFor}
          productId={productId}
        />
      )}
    </>
  );
};

export default SkuDetailsList;
