"use client";

import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { getFormatedStringFromDays } from "../../../utils";
import {
  Button,
  Card,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Product } from "../../../services/Products.service";

const intialState = {
  skuName: "",
  price: 0,
  validity: 0,
  validityType: "Select Type",
  lifetime: false,
};

const SkuDetailsForm = ({
  setSkuDetailsFormShow,
  productId,
  setAllSkuDetails,
  allSkuDetails,
  skuIdForUpdate,
  setSkuIdForUpdate,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [skuForm, setSkuForm] = React.useState(intialState);

  const handleCancel = () => {
    setSkuIdForUpdate("");
    setSkuForm(intialState);
    setSkuDetailsFormShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { skuName, price, validity, lifetime } = skuForm;
      if (!skuName || !price) {
        throw new Error("Invalid data");
      }
      if (!lifetime && !validity) {
        throw new Error("Invalid data");
      }
      if (!lifetime && skuForm.validityType === "Select Type") {
        throw new Error("Invalid data");
      }

      if (!lifetime) {
        skuForm.validity =
          skuForm.validityType === "months"
            ? skuForm.validity * 30 // convert to days to store
            : skuForm.validity * 365;
        ``;
      }
      // convert to days to store
      else {
        skuForm.validity = Number.MAX_SAFE_INTEGER;
      }

      const skuDetailsRes = skuIdForUpdate
        ? await Product.updateSku(productId, skuIdForUpdate, skuForm)
        : await Product.addSku(productId, {
            skuDetails: [skuForm],
          });
      if (!skuDetailsRes.success) {
        throw new Error(skuDetailsRes.message);
      }

      setSkuDetailsFormShow(false);
      setSkuIdForUpdate("");
      setAllSkuDetails(skuDetailsRes.result?.skuDetails);
      window.location.reload();
      toast.success(skuDetailsRes.message)
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (skuIdForUpdate) {
      const skuDetail = allSkuDetails.find((sku) => sku._id === skuIdForUpdate);
      if (skuDetail) {
        const validityTime = getFormatedStringFromDays(skuDetail.validity);
        setSkuForm({
          ...intialState,
          ...skuDetail,
          validity: Number(validityTime.split(" ")[0]) || 0,
          validityType: validityTime.split(" ")[1] || "months",
        });
      }
    }
  }, [skuIdForUpdate, allSkuDetails]);

  return (
    <>
      <Card style={{ padding: "10px" }}>
        <h6 style={{ color: "green" }}>SKU information ::</h6>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>SKU Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter SKU Name"
              value={skuForm.skuName}
              onChange={(e) =>
                setSkuForm({ ...skuForm, skuName: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>SKU Price For Each License</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter SKU Price"
              value={skuForm.price}
              onChange={(e) =>
                setSkuForm({ ...skuForm, price: parseFloat(e.target.value) })
              }
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>SKU Validity</Form.Label>{" "}
            <small style={{ color: "grey" }}>
              (If validity is lifetime then check the box)
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Lifetime"
                checked={skuForm.lifetime}
                onChange={(e) =>
                  e.target.checked
                    ? setSkuForm({
                        ...skuForm,
                        lifetime: e.target.checked,
                        validity: 0,
                        validityType: "Select Type",
                      })
                    : setSkuForm({
                        ...skuForm,
                        validity: 0,
                        lifetime: e.target.checked,
                        validityType: "Select Type",
                      })
                }
              />
            </small>
            <InputGroup className="mb-3">
              <Form.Control
                aria-label="Text input with checkbox"
                disabled={skuForm.lifetime}
                type="number"
                value={skuForm.validity}
                onChange={(e) =>
                  setSkuForm({ ...skuForm, validity: parseInt(e.target.value) })
                }
              />
              <DropdownButton
                variant="outline-secondary"
                title={skuForm.validityType}
                id="input-group-dropdown-9"
                disabled={skuForm.lifetime}
                align="end"
                onSelect={(e) =>
                  setSkuForm({
                    ...skuForm,
                    validityType: e || "",
                  })
                }
              >
                <Dropdown.Item href="#" eventKey={"months"}>
                  Months
                </Dropdown.Item>
                <Dropdown.Item href="#" eventKey={"years"}>
                  Years
                </Dropdown.Item>
              </DropdownButton>
            </InputGroup>
          </Form.Group>

          <div style={{ marginTop: "10px" }}>
            <Button variant="outline-info" onClick={handleCancel}>
              Cancel
            </Button>{" "}
            <Button
              variant="outline-primary"
              type="submit"
              onClick={(e) => handleSubmit(e)}
              disabled={isLoading}
            >
              {isLoading && (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              Submit
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );
};

export default SkuDetailsForm;
