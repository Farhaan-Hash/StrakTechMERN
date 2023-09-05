import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Form, Button, FormGroup, FormLabel, FormControl} from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import {saveShippingAddress} from "../slices/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingScreen = () => {
  const {shippingAddress} = useSelector((state) => state.cart);
  const [address, setAddress] = useState(shippingAddress?.address || ""); //already present shipping address then that stays there.
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({address, city, postalCode, country}));
    navigate("/payment");
  };
  const steps = [
    {label: "Sign In", link: "/login"},
    {label: "Shipping", link: "/shipping"},
    {label: "Payment", link: "/payment"},
    {label: "Place Order", link: "/placeorder"},
  ];

  const currentStep = 1; // Set the current step index here (starting from 0)

  return (
    <>
      <CheckoutSteps steps={steps} currentStep={currentStep} />
      <FormContainer>
        <h2 className="text-success mt-4 text-center">Shipping</h2>
        <Form onSubmit={submitHandler}>
          <FormGroup controlId="address" className="my-3">
            <FormLabel>Address</FormLabel>
            <FormControl
              type="text"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></FormControl>
          </FormGroup>
          <FormGroup controlId="city" className="my-2">
            <FormLabel>City</FormLabel>
            <FormControl
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            ></FormControl>
          </FormGroup>
          <FormGroup controlId="postalCode" className="my-2">
            <FormLabel>Postal Code</FormLabel>
            <FormControl
              type="text"
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            ></FormControl>
          </FormGroup>
          <FormGroup controlId="country" className="my-2">
            <FormLabel>Country</FormLabel>
            <FormControl
              type="text"
              placeholder="Enter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            ></FormControl>
          </FormGroup>
          <Button type="submit" variant="success" className="my-2">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
