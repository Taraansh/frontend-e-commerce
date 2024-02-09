"use client";
import React, { FC, useContext, useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validator from "validator";
import { User } from "../../../services/User.service";
import { useRouter } from "next/navigation";
import { Context } from "../../../context";

// interface IRegisterLoginProps {
//   isRegisterForm?: boolean;
// }

const initialForm = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
};

const RegisterLogin = ({ isRegisterForm = false }) => {
  const [authForm, setAuthForm] = React.useState(initialForm);
  const [otpForm, setOtpForm] = React.useState({ otp: "", email: "" });
  const [otpTime, setOtpTime] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  useEffect(() => {
    if (user && user.email) {
      router.push("/my-account");
    }
  }, [router, user]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const { email, name, password, confirmPassword } = authForm;
      if (!name || !email || !password || !confirmPassword) {
        throw new Error("Please fill all the details");
      }
      if (password !== confirmPassword) {
        throw new Error("Password and Confirm password didn't match");
      }
      if (password.length < 6) {
        throw new Error("Password length must be atleast 6 characters long");
      }
      if (!validator.isEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      const payload = { email, name, password, type: "customer" };

      const { success, message } = await User.createUsers(payload);
      if (success) {
        setAuthForm(initialForm);
        setOtpForm({ otp: "", email: payload.email });
        setOtpTime(true);
        return toast.success(message);
      }
      throw new Error(message || "Something went wrong");

      //   console.log("handleRegister::", authForm);
    } catch (error) {
      if (error.response) {
        return toast.error(error.response.data.message);
      }
      return toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const { email, password } = authForm;
      if (!email || !password) {
        throw new Error("Please fill all the details");
      }
      if (!validator.isEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      const payload = { email, password };

      const { success, result, message } = await User.loginUser(payload);
      if (success) {
        setAuthForm(initialForm);
        localStorage.setItem('_e_commerce_user', JSON.stringify(result?.user))
        dispatch({ type: "LOGIN", payload: result?.user });
        router.push("/my-account");
        return toast.success(message);
      }
      throw new Error(message || "Something went wrong");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      return toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (e) => {
    e.preventDefault();
    try {
      const { email } = otpForm;
      if (!email) {
        throw new Error("Please enter your email address");
      }
      if (!validator.isEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      const { success, message } = await User.resendOtp(email);
      if (success) {
        setOtpTime(true);
        return toast.success(message);
      }
      throw new Error(message || "Something went wrong.");
    } catch (error) {
      if (error.response) {
        return toast.error(error.response.data.message);
      }
      return toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const { otp, email } = otpForm;
      if (!otp || !email) {
        throw new Error("Please enter your email address and otp");
      }
      const { success, message } = await User.verifyOtp(otp, email);
      if (success) {
        setOtpTime(false);
        setOtpForm({ otp: "", email: "" });
        return toast.success(message);
      }
      throw new Error(message || "Something went wrong");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      return toast.error(error.message);
    }
  };

  return (
    <>
      <Card>
        <Card.Header>
          {isRegisterForm ? "Register Form" : "Login Form"}
        </Card.Header>
        <Card.Body>
          {isRegisterForm ? (
            <>
              <Form
                onSubmit={(e) => {
                  handleRegister(e);
                }}
              >
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Full Name"
                    value={authForm.name}
                    autoComplete="name"
                    onChange={(e) => {
                      setAuthForm({ ...authForm, name: e.target.value });
                    }}
                  ></Form.Control>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={authForm.email || otpForm.email}
                    autoComplete="email"
                    onChange={(e) => {
                      setAuthForm({ ...authForm, email: e.target.value });
                    }}
                  ></Form.Control>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={authForm.password}
                    onChange={(e) => {
                      setAuthForm({ ...authForm, password: e.target.value });
                    }}
                  ></Form.Control>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={authForm.confirmPassword}
                    onChange={(e) => {
                      setAuthForm({
                        ...authForm,
                        confirmPassword: e.target.value,
                      });
                    }}
                  ></Form.Control>
                </Form.Group>
                {!otpTime && (
                  <Button
                    type="submit"
                    className="btnAuth my-1"
                    variant="outline-secondary"
                    id="button-addon2"
                    style={{ width: "fit-content" }}
                  >
                    Register
                  </Button>
                )}
              </Form>

              {/* {true && ( */}
              {otpTime && (
                <Form>
                  <Form.Group>
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter OTP"
                      value={otpForm.otp}
                      onChange={(e) => {
                        setOtpForm({ ...otpForm, otp: e.target.value });
                      }}
                    ></Form.Control>
                    <Button
                      type="submit"
                      className="btnAuth my-1"
                      variant="outline-secondary"
                      id="button-addon2"
                      style={{ width: "fit-content" }}
                      onClick={(e) => {
                        verifyOtp(e);
                      }}
                    >
                      Verify
                    </Button>
                    <Button
                      className="btnAuth my-1 mx-1"
                      variant="outline-secondary"
                      id="button-addon2"
                      style={{ width: "fit-content" }}
                      onClick={(e) => {
                        resendOtp(e);
                      }}
                    >
                      Resend OTP
                    </Button>
                  </Form.Group>
                </Form>
              )}
            </>
          ) : (
            <Form
              onSubmit={(e) => {
                handleLogin(e);
              }}
            >
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={authForm.email}
                  onChange={(e) => {
                    setAuthForm({ ...authForm, email: e.target.value });
                  }}
                ></Form.Control>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={authForm.password}
                  onChange={(e) => {
                    setAuthForm({ ...authForm, password: e.target.value });
                  }}
                ></Form.Control>
              </Form.Group>
              <Button
                type="submit"
                className="btnAuth my-1"
                variant="info"
                id="button-addon2"
                style={{ width: "fit-content" }}
              >
                Login
              </Button>
              <br />
              <a style={{ textDecoration: "none" }} href="/forgot-password">
                Forgot Password?
              </a>
            </Form>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default RegisterLogin;
