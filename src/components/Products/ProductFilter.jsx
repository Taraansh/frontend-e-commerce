import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { Card, Dropdown, DropdownButton, ListGroup } from "react-bootstrap";
import { Context } from "../../../context";

const ProductFilter = () => {
  const router = useRouter();
  const [filterCatText, setFilterCatText] = React.useState("Category");
  const [filterPlatformText, setFilterPlatformText] =
    React.useState("Platform");

  const { fetchProducts } = useContext(Context);

  return (
    <Card style={{width:'fit-content'}}>
      <Card.Header>Filter By</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <DropdownButton
            variant="outline-secondary"
            title={filterCatText}
            id="input-group-dropdown-1"
            onSelect={(e) => {
              fetchProducts("category", e);
            }}
          >
            <Dropdown.Item>Select category</Dropdown.Item>
            <Dropdown.Item eventKey="Operating System">
              Operating System
            </Dropdown.Item>
            <Dropdown.Item eventKey="Application Software">
              Application Software
            </Dropdown.Item>
          </DropdownButton>
        </ListGroup.Item>
        <ListGroup.Item>
          <DropdownButton
            variant="outline-secondary"
            title={filterPlatformText}
            id="input-group-dropdown-1"
            onSelect={(e) => {
              fetchProducts("platformType", e);
            }}
          >
            <Dropdown.Item>Select platform</Dropdown.Item>
            <Dropdown.Item eventKey="Windows">Windows</Dropdown.Item>
            <Dropdown.Item eventKey="Android">Android</Dropdown.Item>
            <Dropdown.Item eventKey="iOS">iOS</Dropdown.Item>
            <Dropdown.Item eventKey="Linux">Linux</Dropdown.Item>
            <Dropdown.Item eventKey="Mac">Mac</Dropdown.Item>
          </DropdownButton>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};

export default ProductFilter;
