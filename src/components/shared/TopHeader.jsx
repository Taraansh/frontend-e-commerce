"use client";

import {
  Nav,
  Navbar,
  NavDropdown,
  Badge,
  Button,
  Form,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import { PersonCircle, Search } from "react-bootstrap-icons";
import styles from "../../../styles/Home.module.css";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { Context } from "../../../context";
import CartOffCanvas from "../Products/CartOffCanvas";
import { usePathname } from "next/navigation";

const TopHeader = () => {
  const [show, setShow] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");

  const [baseType, setBaseType] = React.useState("Applications");

  const {
    state: { user },
    cartItems,
    fetchProducts,
  } = useContext(Context);

  const router = useRouter();
  const pathname = usePathname();

  const searchAtHome = async () => {
    router.push("/products");
    {
      pathname !== "/"
        ? fetchProducts("productName", searchText)
        : fetchProducts("productName", searchText);
    }
  };

  return (
    <>
      <Row className="mt-3">
        <Col xs={6} md={4}>
          <h3 className={styles.logoHeading} onClick={() => router.push("/")}>
            ShopMonk
          </h3>
        </Col>
        {pathname !== "/auth" && (
          <Col xs={6} md={4}>
            <InputGroup>
              <InputGroup.Text id="inputGroup-sizing-default">
                <Search />
              </InputGroup.Text>
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder="Search the product here..."
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                onKeyPress={(e) => {
                  e.key === "Enter" && searchAtHome(e);
                }}
              />
              <Button
                variant="outline-success"
                id="button-addon2"
                disabled={!searchText}
                onClick={() => {
                  searchAtHome(searchText);
                }}
              >
                Search
              </Button>
            </InputGroup>
          </Col>
        )}

        <Col>
          <PersonCircle
            height="40"
            width="40"
            color="#4c575f"
            style={{ float: "right" }}
            onClick={() => {
              if (user && user.email) {
                router.push("/my-account");
              } else {
                router.push("/auth");
              }
            }}
          />
        </Col>
      </Row>

      {pathname !== "/auth" && user && user.email && (
        <Navbar
          collapseOnSelect
          expand="lg"
          bg="light"
          variant="light"
          color="#4c575f"
        >
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => router.push("/")}>Home</Nav.Link>
              <Nav.Link onClick={() => router.push("/products/")}>
                Products
              </Nav.Link>
              {pathname !== "/" && (
                <>
                  <NavDropdown
                    title={baseType}
                    id="collasible-nav-dropdown"
                    onSelect={(e) => {
                      setBaseType(e);
                      e === "Applications"
                        ? fetchProducts()
                        : fetchProducts("baseType", e);
                    }}
                  >
                    <NavDropdown.Item eventKey="Computer">
                      Computer
                    </NavDropdown.Item>
                    <NavDropdown.Item eventKey="Mobile">
                      Mobile
                    </NavDropdown.Item>
                    <NavDropdown.Item eventKey="Applications">
                      All
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
            </Nav>
            <Nav>
              <Nav.Link
                className={styles.cartItems}
                onClick={() => setShow(true)}
              >
                Items: <Badge bg="secondary">{cartItems.length}</Badge> (₹
                {cartItems
                  .map((item) => Number(item.price) * Number(item.quantity))
                  .reduce((a, b) => a + b, 0)}
                )
              </Nav.Link>
              <Nav.Link eventKey={2} href="#memes"></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )}
      <CartOffCanvas setShow={setShow} show={show} />
    </>
  );
};

export default TopHeader;
