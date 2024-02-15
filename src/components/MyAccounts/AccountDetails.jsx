"use client";

import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { User } from "../../../services/User.service";

const AccountDetails = ({ user, dispatch }) => {
  const [accountForm, setAccountForm] = useState({
    name: user?.name,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const { name, oldPassword, newPassword, confirmPassword } = accountForm;
      if (!name || !oldPassword || !newPassword || !confirmPassword) {
        throw new Error("Please fill all the details");
      }
      if (newPassword !== confirmPassword) {
        throw new Error("Password and Confirm password didn't match");
      }
      if (newPassword.length < 6) {
        throw new Error("Password length must be atleast 6 characters long");
      }

      const payload = { name, oldPassword, newPassword };

      const { success, message, result } = await User.updateUser(
        user.id,
        payload
      );
      if (!success) {
        throw new Error(message);
      }
      dispatch({
        type: "UPDATE_USER",
        payload: result,
      });
      toast.success(message);
      setAccountForm({
        name: result?.name,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error.response) {
        return toast.error(error.response.data.message);
      }
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="mt-3">
        <Card.Header>Your Account Details</Card.Header>
        <Card.Body>
          <Form
            onSubmit={(e) => {
              handleUpdate(e);
            }}
          >
            <Form.Group controlId="formBasicName" className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                defaultValue={user?.name}
                onChange={(e) => {
                  setAccountForm({ ...accountForm, name: e.target.value });
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                defaultValue={user?.email}
                disabled
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="formBasicOldPassword" className="mb-3">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Old Password"
                value={accountForm.oldPassword}
                onChange={(e) => {
                  setAccountForm({
                    ...accountForm,
                    oldPassword: e.target.value,
                  });
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="formBasicNewPassword" className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter New Password"
                value={accountForm.newPassword}
                onChange={(e) => {
                  setAccountForm({
                    ...accountForm,
                    newPassword: e.target.value,
                  });
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="formBasicConfirmPassword" className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Confirm Password"
                value={accountForm.confirmPassword}
                onChange={(e) => {
                  setAccountForm({
                    ...accountForm,
                    confirmPassword: e.target.value,
                  });
                }}
              ></Form.Control>
            </Form.Group>
            <Button
              variant="info"
              className="btnAuth"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default AccountDetails;
