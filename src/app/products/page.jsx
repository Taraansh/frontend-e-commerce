"use client";

import Link from "next/link";
import React, { useState, useEffect, useContext } from "react";
import { Row, Col } from "react-bootstrap";
import ProductFilter from "@/components/Products/ProductFilter";
import ProductItem from "@/components/Products/ProductItem";
import PaginationDisplay from "@/components/shared/PaginationDisplay";
import { Context } from "../../../context";
import { PlusCircle } from "react-bootstrap-icons";

const AllProducts = () => {
  const [userType, setUserType] = useState("customer");

  const { state, products, metadata } = useContext(Context);

  useEffect(() => {
    if (state.user) {
      setUserType(state.user.type);
    }
    // console.log(state)
  }, [state]);

  return (
    <>
      <Row>
        <Col md={8}></Col>
        <Col md={4}>
          {userType === "admin" && (
            <Link
              href="/products/update-product"
              className="btn btn-primary btnAddProduct"
            >
              <PlusCircle className="btnAddProductIcon" />
              Add Product
            </Link>
          )}
        </Col>
      </Row>
      <Row>
        <Col sm={2}>
          <ProductFilter />
        </Col>
        <Col sm={10}>
          <div
            style={{
              display: "flex",
              // justifyContent: "space-evenly",
              flexWrap: "wrap",
            }}
          >
            {products && products.length > 0 ? (
              products.map((product) => {
                return (
                  <div key={product._id} style={{ margin: "0.3rem 0.3rem" }}>
                    <ProductItem userType={userType} product={product} />
                  </div>
                );
              })
            ) : (
              <h3>No Products Found</h3>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <PaginationDisplay metadata={metadata} />
          <div className="row h-100">
            <div className="col-sm-12 my-auto">
              <div
                style={{ float: "right", color: "#2b7fe0", fontSize: "13px" }}
              >
                Showing{" "}
                {metadata?.total > metadata?.limit
                  ? metadata?.limit
                  : metadata?.total}{" "}
                of {metadata?.total} results
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default AllProducts;
