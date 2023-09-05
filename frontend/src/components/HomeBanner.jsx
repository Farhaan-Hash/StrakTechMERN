import React, {useState, useEffect} from "react";
import {Row, Col, Button} from "react-bootstrap";
import scooter from "../assets/66.gif";
import {Link} from "react-router-dom";

const HomeBanner = () => {
  const [remainingTime, setRemainingTime] = useState(600); // 10 minutes in seconds
  const [dealMissed, setDealMissed] = useState(false); // State to track if the deal is missed

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(interval);
          setDealMissed(true); // Set the deal as missed when the timer reaches 0
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const bannerStyle = {
    backgroundImage: `url(https://images.pexels.com/photos/7987589/pexels-photo-7987589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "20px",
    zIndex: 10,
    borderRadius: "20px",
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60); // Calculate minutes
    const seconds = time % 60; // Calculate remaining seconds
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="jumbotron jumbotron-fluid mt-4 w-full">
      <Row className="banner-container" style={bannerStyle}>
        <Col
          sm={3}
          className="right d-flex justify-content-end align-items-end"
        >
          <img
            src={scooter}
            width={200}
            height={200}
            alt="Movable"
            className="img-fluid movable-image"
          />
        </Col>

        <Col
          sm={9}
          className="left d-flex justify-content-start align-items-end"
        >
          <div>
            {dealMissed ? (
              // Render this message when the deal is missed
              <h1 className="text-danger">
                <i>Missed the deal, come back later!</i>
              </h1>
            ) : (
              // Render this message while the timer is active
              <h1 className="text-danger">
                <i>Offers valid only for today. Hurry now!</i>
              </h1>
            )}
            <h4 className="text-white">
              Time left: {formatTime(remainingTime)}
            </h4>
            {dealMissed ? (
              // Render a different message or button when the deal is missed
              <Button className="btn-danger mt-3" disabled>
                Deal Missed
              </Button>
            ) : (
              <Link to="/products">
                <Button className="btn-success mt-3">Shop Now</Button>
              </Link>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HomeBanner;
