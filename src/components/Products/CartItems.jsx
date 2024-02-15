import React from "react";
import { getFormatedStringFromDays } from "../../../utils";
import { Trash } from "react-bootstrap-icons";
import { Badge, Button, Image } from "react-bootstrap";
import Link from "next/link";

const CartItems = ({ cartItems, cartDispatch }) => {
  const cartDeleteHandler = (id) => {
    cartDispatch({ type: "REMOVE_FROM_CART", payload: { skuId: id } });
  };
  return (
    <>
      {cartItems.length > 0 ? (
        cartItems.map((item, index) => {
          return (
            <div
              className="d-flex justify-content-between align-items-center mt-3 p-2 items rounded"
              key={index}
            >
              <div className="d-flex flex-row">
                <Image
                  alt=""
                  height={50}
                  width={50}
                  roundedCircle={true}
                  src={item.productImage}
                />
                <div className="ml-2">
                  <span className="d-block">{item.productName}</span>
                  <span className="spec">
                    <Badge bg="info" text="dark">
                      {item.lifetime
                        ? "Lifetime"
                        : getFormatedStringFromDays(item.validity)}
                    </Badge>
                  </span>
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <span>
                  {item.quantity} X ₹{item.price}
                </span>
                <Button
                  variant="outline-danger"
                  style={{ marginLeft: "5px" }}
                  onClick={() => cartDeleteHandler(item.skuId)}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="d-flex flex-row">
          <h4>No items in cart</h4>
          <Link href={`/products`}>
            <Button variant="outline-primary" style={{ marginLeft: "10px" }}>
              Shop Now
            </Button>
          </Link>
        </div>
      )}
      <hr />
      {cartItems && cartItems.length > 0 && (
        <div className="calPlace">
          <p className="cartTotal" style={{ textAlign: "end" }}>
            Total: ₹
            {cartItems
              .map((item) => Number(item.price) * Number(item.quantity))
              .reduce((a, b) => a + b, 0)}
          </p>
        </div>
      )}
    </>
  );
};

export default CartItems;
