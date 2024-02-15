"use client";

import styles from "../../styles/Home.module.css";
import { Button, Col, Row } from "react-bootstrap";
import ProductItem from "@/components/Products/ProductItem";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState({});

  const fetchProducts = async () => {
    const { data } = await axios.get(
      `${
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BASE_API_PROD_URL
          : process.env.NEXT_PUBLIC_BASE_API_URL
      }/products?homepage=true`
    );
    setProducts(data.result[0]);
    // console.log(data.result[0]);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <h3 className={styles.productCats}>Latest Products</h3>
      <Row className="g-4">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {products?.latestProducts &&
            products?.latestProducts.map((product, index) => {
              return (
                <div key={index} style={{ margin: "0.5rem 0.3rem" }}>
                  <ProductItem product={product} userType={"customer"} />
                </div>
              );
            })}
        </div>
      </Row>
      <hr />
      <h3 className={styles.productCats}>Top Rated Products</h3>
      <Row className="g-4">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {products?.latestProducts &&
            products.topRatedProducts &&
            products.topRatedProducts.map((product, index) => {
              return (
                <div key={index} style={{ margin: "0.5rem 0.3rem" }}>
                  <ProductItem product={product} userType={"customer"} />
                </div>
              );
            })}
        </div>
      </Row>
      <Row>
        <Col>
          <Button
            variant="primary"
            className={styles.viewMoreBtn}
            onClick={() => {
              router.push("/products");
            }}
          >
            View More
          </Button>
        </Col>
      </Row>
    </>
  );
}
