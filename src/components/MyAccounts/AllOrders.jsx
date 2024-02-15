"use client";

import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { Orders } from "../../../services/Order.service";
import { Table, Badge } from "react-bootstrap";
import Link from "next/link";

const AllOrders = () => {
  const [orders, setOrders] = React.useState([]);

  const fetchOrders = async () => {
    try {
      const ordersRes = await Orders.fetchAll();
      if (!ordersRes.success) {
        throw new Error(ordersRes.message);
      }
      // console.log(ordersRes);
      setOrders(ordersRes.result);
    } catch (error) {
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
    }
  };

  useEffect(() => {
    fetchOrders();
    //eslint-disable-next-line react-hoops/exhaustive-deps
  }, []);
  

  const dateToLocal = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <>
      <Table responsive>
        <thead>
          <tr>
            <th>Ordered By</th>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Order Status</th>
            <th>Order Total</th>
            <th>Order Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>
                  {order.userName}
                </td>
                <td style={{ color: "green", cursor: "pointer" }}>
                  <Link href={`/orders/${order._id}`}>{order.orderId}</Link>
                </td>
                <td>{dateToLocal(order.createdAt)}</td>
                <td>
                  <Badge>{order.orderStatus.toUpperCase()}</Badge>
                </td>
                <td>₹{order.paymentInfo.paymentAmount} </td>
                <td>
                  <Link href={`/orders/${order._id}`} style={{textDecoration: 'underline'}}>View Order Details</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No orders yet.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};

export default AllOrders;
