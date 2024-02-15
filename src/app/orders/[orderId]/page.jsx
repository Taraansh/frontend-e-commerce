"use client";

import axios from "axios";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Col,
  Image,
  ListGroup,
  Row,
  Table,
} from "react-bootstrap";
import { Clipboard } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import React, { useEffect } from "react";

const Order = ({ params }) => {
  const [order, setOrder] = React.useState({});

  const fetchOrder = async (orderId) => {
    try {
      if (orderId) {
        const { data } = await axios.get(
          // `${process.env.NEXT_PUBLIC_BASE_API_URL}/orders/${orderId}`
          `http://localhost:3100/api/v1/orders/${orderId}`
        );
        // console.log(data.result);
        setOrder(data.result);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrder(params.orderId);
  }, [params]);

  // console.log(params);

  const dateToLocal = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <>
      <Row>
        <Col>
          <Card style={{ marginTop: "20px" }}>
            <Card.Header> Order Details</Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Products</th>
                    <th>License Keys</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.orderedItems?.map((item) => (
                    <tr key={item.skuCode}>
                      <td>
                        <div className="itemTitle">
                          <Image
                            height={50}
                            width={50}
                            roundedCircle={true}
                            src={
                              item.productImage ||
                              "https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg"
                            }
                            alt=""
                          />
                          <p style={{ marginLeft: "5px" }}>
                            <Link
                              href={`/products/${item.productId}`}
                              style={{ textDecoration: "none" }}
                            >
                              {item.productName || "Demo Product"}
                            </Link>
                            <br />
                            <span style={{ fontWeight: "bold" }}>
                              {item.quantity} X ₹{item.price}
                            </span>
                          </p>
                        </div>
                      </td>
                      <td>
                        {item.license || " Not Found "}
                        {item.license && (
                          <Button
                            variant="light"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(item.license);
                              addToast("License key copied successfully", {
                                appearance: "success",
                                autoDismiss: true,
                              });
                            }}
                          >
                            <Clipboard />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card style={{ marginTop: "20px" }}>
            <Card.Header>
              <Card.Title>
                Total Amout : ₹{order?.paymentInfo?.paymentAmount}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>
                  Ordered By: {order?.userName}
                </ListGroup.Item>
                <ListGroup.Item>
                  Order Date & Time: {dateToLocal(order?.createdAt)}
                </ListGroup.Item>
                <ListGroup.Item>
                  Payment Method: {order?.paymentInfo?.paymentMethod}
                </ListGroup.Item>
                <ListGroup.Item>
                  Order Status: <Badge>{order?.orderStatus}</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  Add Line 1 : {order?.customerAddress?.line1}
                  <br />
                  Add Line 2 : {order?.customerAddress?.line2}
                  <br />
                  City : {order?.customerAddress?.city}
                  <br />
                  State : {order?.customerAddress?.state}
                  <br />
                  Country : {order?.customerAddress?.country}
                  <br />
                  Postal Code : {order?.customerAddress?.postal_code}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Order;
