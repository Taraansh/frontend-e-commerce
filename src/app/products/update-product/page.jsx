"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import { Check2Circle, Archive, Pen } from "react-bootstrap-icons";
import { Product } from "../../../../services/Products.service";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const initialForm = {
  productName: "",
  description: "",
  category: "",
  baseType: "",
  platformType: "",
  productUrl: "",
  downloadUrl: "",
  highlights: [],
  requirementSpecification: [],
};

const UpdateProduct = ({ product }) => {
  const [productForm, setProductForm] = React.useState(initialForm);
  const [requirementName, setRequirementName] = React.useState("");
  const [requirementDescription, setRequirementDescription] =
    React.useState("");

  const [updateRequirementIndex, setUpdateRequirementIndex] =
    React.useState(-1);

  const [highlight, setHighlight] = React.useState("");
  const [updateHighlightIndex, setUpdateHighlightIndex] = React.useState(-1);
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const productIdForUpdate = searchParams.get("productId");

  useEffect(() => {
    if (product && product?.productName) {
      setProductForm({ ...initialForm, ...product });
    }
  }, [product]);

  const fetchProduct = async (productIdForUpdate) => {
    try {
      if (productIdForUpdate) {
        const { data } = await axios.get(
          //   `${process.env.NEXT_PUBLIC_BASE_API_URL}/products/65c06893aebfdc0ab9c15fb0`
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/products/${productIdForUpdate}`
        );
        setProductForm({ ...initialForm, ...data.result.product });
        // console.log(data.result.product._id);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct(productIdForUpdate);
  }, [productIdForUpdate]);

  const handleRequirementAdd = async (e) => {
    e.preventDefault();
    if (updateRequirementIndex !== -1) {
      setProductForm({
        ...productForm,
        requirementSpecification: productForm.requirementSpecification.map(
          (requirement, index) => {
            if (index === updateRequirementIndex) {
              return {
                [requirementName]: requirementDescription,
              };
            } else {
              return requirement;
            }
          }
        ),
      });
    } else {
      setProductForm({
        ...productForm,
        requirementSpecification: [
          ...productForm.requirementSpecification,
          {
            [requirementName]: requirementDescription,
          },
        ],
      });
    }

    setRequirementName("");
    setRequirementDescription("");
    setUpdateRequirementIndex(-1);
  };

  const hanldleHighlightAdd = async (e) => {
    e.preventDefault();
    if (updateHighlightIndex > -1) {
      setProductForm({
        ...productForm,
        highlights: productForm.highlights.map((value, index) => {
          if (index === updateHighlightIndex) {
            return highlight;
          }
          return value;
        }),
      });
    } else {
      setProductForm({
        ...productForm,
        highlights: [...productForm.highlights, highlight],
      });
    }
    setHighlight("");
    setUpdateHighlightIndex(-1);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      //   console.log(productForm)
      if (productIdForUpdate) {
        //update product
        await Product.updateProduct(productIdForUpdate, productForm);
        router.push(`/products/`);
        toast.success("Product Updated successfully");
      } else {
        // create product
        await Product.createProduct(productForm);
        toast.success("Product Created successfully");
      }
    } catch (error) {
      if (error.response) {
        return toast.error(error.response.data.message);
      }
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        className="updateProductCard"
        style={{ padding: "15px", marginTop: "20px" }}
      >
        <Row>
          <h4 className="text-center productFormHeading">Product Details</h4>
          <hr />
          <Col>
            <Form>
              <Form.Group controlId="productName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Product Name"
                  value={productForm.productName}
                  onChange={(e) => {
                    setProductForm({
                      ...productForm,
                      productName: e.target.value,
                    });
                  }}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Product Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter Product Description"
                  value={productForm.description}
                  onChange={(e) => {
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    });
                  }}
                />
              </Form.Group>
              <Form.Group controlId="requirements">
                <Form.Label>Product Requirements</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Enter Requirement Name"
                    value={requirementName}
                    onChange={(e) => {
                      setRequirementName(e.target.value);
                    }}
                  />
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Enter Requirement Descritpion"
                    value={requirementDescription}
                    onChange={(e) => {
                      setRequirementDescription(e.target.value);
                    }}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={(e) => {
                      handleRequirementAdd(e);
                    }}
                  >
                    <Check2Circle />
                  </Button>
                </InputGroup>
              </Form.Group>
              <div>
                <p style={{ color: "#10557a" }}>Requirements Specification</p>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productForm.requirementSpecification.length > 0 ? (
                      productForm.requirementSpecification.map(
                        (item, index) => (
                          <tr key={index}>
                            <td>{Object.keys(item)[0]}</td>
                            <td>{Object.values(item)[0]}</td>
                            <td>
                              <Button
                                variant="secondary"
                                size="sm"
                                style={{ marginRight: "4px" }}
                                onClick={() => {
                                  setUpdateRequirementIndex(index);
                                  setRequirementName(Object.keys(item)[0]);
                                  setRequirementDescription(
                                    Object.values(item)[0]
                                  );
                                }}
                              >
                                <Pen />
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setProductForm({
                                    ...productForm,
                                    requirementSpecification:
                                      productForm.requirementSpecification.filter(
                                        (item, key) => key !== index
                                      ),
                                  });
                                  setRequirementDescription("");
                                  setRequirementName("");
                                }}
                              >
                                <Archive />
                              </Button>
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center">
                          No Requirements
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Form>
          </Col>
          <Col>
            <Form>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Product Category</Form.Label>
                <Form.Select
                  aria-label="Select Category"
                  value={productForm.category}
                  onChange={(event) => {
                    const value = event.target.value;
                    setProductForm({
                      ...productForm,
                      category: value,
                    });
                  }}
                >
                  <option value="">Choose the category</option>
                  <option value="Operating System">Operating System</option>
                  <option value="Application Software">
                    Application Software
                  </option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Platform Type</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  value={productForm.platformType}
                  onChange={(event) => {
                    const value = event.target.value;
                    setProductForm({
                      ...productForm,
                      platformType: value,
                    });
                  }}
                >
                  <option value="">Choose the platform type</option>
                  <option value="Windows">Windows</option>
                  <option value="iOS">iOS</option>
                  <option value="Linux">Linux</option>
                  <option value="Android">Android</option>
                  <option value="Mac">Mac</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Base Type</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  value={productForm.baseType}
                  onChange={(event) => {
                    const value = event.target.value;
                    setProductForm({
                      ...productForm,
                      baseType: value,
                    });
                  }}
                >
                  <option>Choose the base type</option>
                  <option value="Computer">Computer</option>
                  <option value="Mobile">Mobile</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Product URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Product URL"
                  value={productForm.productUrl}
                  onChange={(event) => {
                    const value = event.target.value;
                    setProductForm({
                      ...productForm,
                      productUrl: value,
                    });
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Product Download URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Product Download URL"
                  value={productForm.downloadUrl}
                  onChange={(event) => {
                    const value = event.target.value;
                    setProductForm({
                      ...productForm,
                      downloadUrl: value,
                    });
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Product Highlights</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter Product Highlight"
                    value={highlight}
                    onChange={(event) => {
                      setHighlight(event.target.value);
                    }}
                    onKeyPress={(event) => {
                      if (event.charCode === 13 || event.which === 13) {
                        hanldleHighlightAdd();
                      }
                    }}
                  />
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      hanldleHighlightAdd(e);
                    }}
                  >
                    <Check2Circle />
                  </Button>
                </InputGroup>
              </Form.Group>
              <p style={{ color: "#10557a" }}>
                Product highlights are listed below:
              </p>
              <ListGroup>
                {productForm.highlights.length > 0 ? (
                  productForm.highlights.map((highlight, index) => (
                    <ListGroup.Item key={index}>
                      {highlight}
                      <span style={{ float: "right" }}>
                        <Pen
                          className="pointer"
                          onClick={() => {
                            setHighlight(highlight);
                            // console.log(index);
                            setUpdateHighlightIndex(index);
                          }}
                        />{" "}
                        &nbsp;&nbsp;
                        <Archive
                          className="pointer"
                          onClick={() => {
                            setProductForm({
                              ...productForm,
                              highlights: productForm.highlights.filter(
                                (highlight, key) => key !== index
                              ),
                            });
                            setHighlight("");
                          }}
                        />
                      </span>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="text-center">
                    No Highlights
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Form>
          </Col>
        </Row>
        <br />
        <Row>
          <Col></Col>
          <Col style={{ textAlign: "end" }}>
            <Link href={`/products`}>
              <Button variant="secondary">Back</Button>
            </Link>{" "}
            <Button
              variant="info"
              onClick={(event) => {
                event.preventDefault();
                setProductForm(initialForm);
              }}
            >
              Cancel
            </Button>{" "}
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => {
                handleSubmitForm(e);
              }}
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
          </Col>{" "}
        </Row>
      </Card>
    </>
  );
};

export default UpdateProduct;
