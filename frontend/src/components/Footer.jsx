import React, {useState, useEffect} from "react";
import {Row, Col, Button} from "react-bootstrap";
import {FaArrowCircleUp} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    // Show the scroll to top arrow when the user scrolls down the page
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: "smooth"});
  };

  return (
    <div className="bg-dark py-5 px-5 text-white mt-5">
      <div className="container">
        <Row>
          <Col md={5}>
            <h4 className="text-success pb-2">About Us</h4>
            <p>
              StarkTech is a leading technology company dedicated to innovation
              and excellence. We provide cutting-edge solutions for businesses
              of all sizes.
            </p>
          </Col>
          <Col md={3}>
            <h4 className="text-success pb-2">Links</h4>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-light">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="text-light">
                  Products
                </a>
              </li>
              <li>
                <a href="/about" className="text-light">
                  About Us
                </a>
              </li>
              <li>
                <a href="/login" className="text-light">
                  Contact Us
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h4 className="text-success pb-2">Contact Info</h4>
            <address>
              123 Main Street <br />
              City, State ZIP Code <br />
              Email: info@starktech.com <br />
              Phone: (123) 456-7890
            </address>
          </Col>
          {showScrollToTop && (
            <Row>
              <Col className="text-end">
                <Button
                  className="btn btn-success rounded-3 p-2 mb-3 mb-md-0 mx-1 rounded"
                  onClick={scrollToTop}
                  title="Scroll to Top"
                >
                  <FaArrowCircleUp size={25} />
                </Button>
              </Col>
            </Row>
          )}
        </Row>
        <hr />
        <Row>
          <Col className="text-center">
            <p>&copy; {currentYear} StarkTech</p>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Footer;
