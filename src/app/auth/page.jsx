"use client";
import RegisterLogin from "@/components/auth/RegisterLogin";
import React from "react";
import { Row, Button } from "react-bootstrap";

const Auth = () => {
  const [typeOfForm, setTypeOfForm] = React.useState(false);
  return (
    <>
      <Row>
        <RegisterLogin
          isRegisterForm={typeOfForm}
          setTypeOfForm={setTypeOfForm}
        />
        <Button
          className="mx-auto my-2"
          variant="outline-secondary"
          id="button-addon2"
          style={{ width: "fit-content" }}
          onClick={() => {
            setTypeOfForm(!typeOfForm);
          }}
        >
          {!typeOfForm
            ? "New User? Register"
            : "Already have an account? Login"}
        </Button>
      </Row>
    </>
  );
};

export default Auth;
