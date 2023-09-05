import React from "react";
import {LinkContainer} from "react-router-bootstrap";
import {FaLongArrowAltRight} from "react-icons/fa";

const CheckoutSteps = ({steps, currentStep}) => {
  return (
    <div className="checkout-steps-container">
      <div className="step-boxes">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <LinkContainer to={step.link}>
              <div
                className={`step-box ${currentStep === index ? "active" : ""}`}
              >
                {step.label}
              </div>
            </LinkContainer>
            {index !== steps.length - 1 && (
              <div className="arrow-icon m-1">
                <FaLongArrowAltRight />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;
