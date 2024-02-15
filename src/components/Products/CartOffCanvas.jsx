import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { toast } from "react-toastify";
import { Button, Offcanvas } from "react-bootstrap";
import { Context } from "../../../context";
import CartItems from "./CartItems";
import { Orders } from "../../../services/Order.service";

const CartOffCanvas = ({ setShow, show }) => {
  const handleClose = () => setShow(false);
  const router = useRouter();
  const { cartItems, cartDispatch } = useContext(Context);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      if (cartItems.length > 0) {
        const sessionRes = await Orders.checkoutSession(cartItems);
        if (!sessionRes.success) {
          throw new Error(sessionRes.message);
        }
        router.push(sessionRes.result);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Shoping Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <CartItems cartItems={cartItems} cartDispatch={cartDispatch} />
          <Button
            variant="primary"
            style={{ width: "100%" }}
            disabled={isLoading}
            onClick={() => handleCheckout()}
          >
            {isLoading && (
              <span
                className="spinner-border spinner-border-sm mr-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            Checkout
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default CartOffCanvas;
