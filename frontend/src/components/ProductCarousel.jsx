import React from "react";
import {Link} from "react-router-dom";
import {useTopRatedProductsQuery} from "../slices/productsApiSlice";
import {Button, Carousel, Image} from "react-bootstrap";
import Loader from "./Loader";
import Messages from "./Messages";

const ProductCarousel = () => {
  const {data, isLoading, isError} = useTopRatedProductsQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Messages variant="danger">
          {isError?.data?.message || isError?.error}
        </Messages>
      ) : (
        <Carousel
          className="slide-in-fwd-center mt-2 mb-5 mx-0 px-0 py-0 w-100 h-100 rounded"
          pause="hover"
          interval={3000}
          controls={false}
          indicators
        >
          {data.map((product) => (
            <Carousel.Item key={product._id}>
              <Link to={`/product/${product._id}`}>
                <Image
                  src={product.image[0]}
                  alt={product.name}
                  className="carousel-image rounded rounded-bottom-0 fluid"
                />
              </Link>
              <div className="text-center absolute-text rounded-5">
                <Button className="text-white btn-dark mx-lg-4 moving-text rounded-3">
                  <h1 className="text-danger text-center fw-bold mb-2 mb-lg-4 mb-xl-4">
                    {" "}
                    Discover the latest trends
                  </h1>
                </Button>
              </div>
              <Carousel.Caption className="text-center pr-4 pb-4">
                <Link to={`/product/${product._id}`}>
                  <h6 className="text-secondary mb-2">{product.name}</h6>
                </Link>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default ProductCarousel;
