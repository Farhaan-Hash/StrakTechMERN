import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Row, Col, Form, Button} from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import {savePaymentMethod} from "../slices/cartSlice";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const steps = [
    {label: "Sign In", link: "/login"},
    {label: "Shipping", link: "/shipping"},
    {label: "Payment", link: "/payment"},
    {label: "Place Order", link: "/placeorder"},
  ];

  const currentStep = 2; // Set the current step index here (starting from 0)

  // Shipping State
  const shippingAddress = useSelector((state) => state.cart.shippingAddress);

  // Check if shipping address is filled or not
  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  // Handle submit of form
  const submitHandler = (e) => {
    e.preventDefault();

    if (paymentMethod) {
      // Check if paymentMethod is selected
      dispatch(savePaymentMethod(paymentMethod));
      navigate("/placeorder");
    } else {
      toast.error("Select Payment method");
    }
  };

  return (
    <>
      <CheckoutSteps steps={steps} currentStep={currentStep} />
      <FormContainer>
        <h2 className="text-success mt-4 text-center">Payment</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Row>
              <Form.Label className="text-success mt-4 " as="legend">
                Select Method:
              </Form.Label>
              <Col>
                <Form.Check
                  type="radio"
                  label="PayPal"
                  id="PayPal"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </Col>
            </Row>
          </Form.Group>
          <Button
            className="mt-2"
            type="submit"
            variant="success"
            disabled={!paymentMethod}
          >
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
