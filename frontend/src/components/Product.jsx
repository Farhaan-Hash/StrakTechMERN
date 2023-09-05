import React from "react";
import {Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import Rating from "./Rating";

const Product = ({product, mainImage}) => {
  return (
    <div className="mt-5">
      <Card
        border="light"
        className="bg-light shadow my-4 p-3 rounded card-hover-pop-up mt-4"
      >
        {/* Use mainImage prop for the image on HomeScreen */}
        <Link to={`/product/${product._id}`}>
          <Card.Img
            src={mainImage || product.image[0]} // Use mainImage if available; otherwise, use the first image from the product.image array
            variant="top"
            className="object-fit-contain"
          />
        </Link>
        <Card.Body>
          <Link to={`/product/${product._id}`}>
            <Card.Title as="div" className="product-title">
              <strong>{product.name}</strong>
            </Card.Title>
          </Link>
          <Card.Text as="div">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </Card.Text>
          <Card.Text as="h5" className="text-secondary text-center mt-2">
            ${product.price}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Product;
