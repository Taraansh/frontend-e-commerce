"use client";
import React, { useContext, useEffect } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import { Context } from "../../../context";
import { toast } from "react-toastify";
import { User } from "../../../services/User.service";
import AccountDetails from "@/components/MyAccounts/AccountDetails";
import { useRouter } from "next/navigation";

const MyAccount = () => {
  const {
    state: { user },
    dispatch,
  } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth");
    }
  }, [user, router]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "LOGOUT", payload: null });
      await User.logoutUser();
      localStorage.removeItem("_e_commerce_user");
      toast.success("Logged Out Successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Tab.Container id="left-tabs-example">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first">Account Details</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">All Orders</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="third"
                  onClick={(e) => {
                    handleLogout(e);
                  }}
                >
                  Logout
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <AccountDetails user={user} dispatch={dispatch} />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <h1>All Orders</h1>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
};

export default MyAccount;
