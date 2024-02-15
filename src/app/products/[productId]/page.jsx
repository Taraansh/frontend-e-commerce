"use client";

import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ProductItem from "@/components/Products/ProductItem";
import {
  Badge,
  Button,
  Card,
  Col,
  Nav,
  Row,
  Tab,
  Table,
} from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import NumericInput from "react-numeric-input";
import { BagCheckFill } from "react-bootstrap-icons";
import { getFormatedStringFromDays } from "../../../../utils";
import { Context } from "../../../../context";
import SkuDetailsList from "@/components/Products/SkuDetailsList";
import CartOffCanvas from "@/components/Products/CartOffCanvas";

const ProductDetails = ({ params }) => {
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [skuDetails, setSkuDetails] = useState([]);

  const [displaySku, setDisplaySku] = useState([]);

  const [quantity, setQuantity] = useState(1);

  const {
    cartItems,
    cartDispatch,
    state: { user },
  } = useContext(Context);

  const fetchProduct = async (productId) => {
    try {
      if (productId) {
        const { data } = await axios.get(
          //   `${process.env.NEXT_PUBLIC_BASE_API_URL}/products/65c06893aebfdc0ab9c15fb0`
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/products/${productId}`
        );
        setProduct(data.result.product);
        setRelatedProducts(data.result.relatedProducts);
        setSkuDetails(data.result.product.skuDetails);
        setDisplaySku(
          data.result.product.skuDetails.sort((a, b) => a.price - b.price)[0]
        );
        // console.log(data.result);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct(params.productId);
  }, [params]);

  const handleCart = () => {
    cartDispatch({
      type: cartItems.find((item) => item.skuId === displaySku._id)
        ? "UPDATE_CART"
        : "ADD_TO_CART",
      payload: {
        skuId: displaySku._id,
        quantity: quantity,
        validity: displaySku.lifetime ? 0 : displaySku.validity,
        lifetime: displaySku.lifetime,
        price: displaySku.price,
        productName: product.productName,
        productImage: product.image,
        productId: product._id,
        skuPriceId: displaySku.stripePriceId,
      },
    });
    setShow(true);
  };

  return (
    <>
      <Row className="firstRow">
        <Col sm={4}>
          <Card>
            <Card.Img variant="top" src={product?.image} />
          </Card>
        </Col>
        <Col sm={8}>
          <h2>{product?.productName}</h2>

          <p className="productPrice" style={{ marginBottom: "5px" }}>
            ₹{displaySku?.price || "000"} {""}
            <Badge bg="warning" text="dark">
              {displaySku?.lifetime
                ? "Lifetime"
                : getFormatedStringFromDays(displaySku?.validity)}
            </Badge>
          </p>
          {/* <div className="divStar">
            <Rating
              name="rate1"
              iconsCount={5}
              readonly
              size={20}
              initialValue={product.avgRating || 0}
              style={{ marginBottom: "10px" }}
            />
            ({product?.feedbackDetails?.length || 0} reviews)
          </div> */}

          <ul>
            {product?.highlights &&
              product?.highlights.length > 0 &&
              product?.highlights.map((highlight, key) => (
                <li key={key}>{highlight}</li>
              ))}
          </ul>

          <div>
            {product?.skuDetails &&
              product?.skuDetails?.length > 0 &&
              product?.skuDetails
                .sort((a, b) => a.validity - b.validity)
                .map((sku, key) => (
                  <Badge
                    bg="info"
                    text="dark"
                    className="skuBtn"
                    key={key}
                    style={{ cursor: "pointer" }}
                    onClick={() => setDisplaySku(sku)}
                  >
                    {sku.lifetime
                      ? "Lifetime"
                      : getFormatedStringFromDays(sku.validity)}
                  </Badge>
                ))}
          </div>

          <div className="productSkuZone">
            <NumericInput
              min={1}
              max={5}
              value={quantity}
              size={5}
              onChange={(value) => setQuantity(Number(value))}
              disabled={!displaySku?.price}
            />
            <Button
              variant="primary"
              className="cartBtn"
              onClick={handleCart}
              disabled={!displaySku?.price}
            >
              <BagCheckFill className="cartIcon" />
              {cartItems.find((item) => item.skuId === displaySku._id)
                ? "Update cart"
                : "Add to cart"}
            </Button>
          </div>
        </Col>
      </Row>
      <br />
      <hr />
      <Row>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first" href="#">
                    Descriptions
                  </Nav.Link>
                </Nav.Item>
                {product?.requirementSpecification &&
                  product?.requirementSpecification.length > 0 && (
                    <Nav.Item>
                      <Nav.Link eventKey="second" href="#">
                        Requirements
                      </Nav.Link>
                    </Nav.Item>
                  )}

                {user?.type === "admin" && (
                  <Nav.Item>
                    <Nav.Link eventKey="fourth" href="#">
                      Product SKUs
                    </Nav.Link>
                  </Nav.Item>
                )}
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">{product?.description}</Tab.Pane>
                <Tab.Pane eventKey="second">
                  <Table responsive>
                    <tbody>
                      {product?.requirementSpecification &&
                        product?.requirementSpecification.length > 0 &&
                        product?.requirementSpecification.map(
                          (requirement, key) => (
                            <tr key={key}>
                              <td width="30%">
                                {Object.keys(requirement)[0]}{" "}
                              </td>
                              <td width="70%">
                                {Object.values(requirement)[0]}
                              </td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </Table>
                </Tab.Pane>
                <Tab.Pane eventKey="fourth">
                  <SkuDetailsList
                    skuDetails={skuDetails}
                    productId={product._id}
                    setAllSkuDetails={setSkuDetails}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Row>
      <br />
      <div className="separator">Related Products</div>
      <br />
      <Row className="g-4">
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          {relatedProducts.map((relatedProduct) => {
            return (
              <ProductItem
                key={relatedProduct._id}
                product={relatedProduct}
                userType={"customer"}
              />
            );
          })}
        </div>
      </Row>
      <CartOffCanvas setShow={setShow} show={show} />
    </>
  );
};

export default ProductDetails;
