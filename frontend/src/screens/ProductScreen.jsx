import React, {useState} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
// import products from "../products";
import {
  Row,
  Col,
  Image,
  ListGroup,
  ListGroupItem,
  Card,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";
import Rating from "../components/Rating";
// import axios from "axios";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Messages from "../components/Messages";
import {useDispatch, useSelector} from "react-redux";
import {addToCart} from "../slices/cartSlice";
import {toast} from "react-toastify";
import Meta from "../components/Meta";

const ProductScreen = () => {
  const {id: productId} = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Get User Info
  const {userInfo} = useSelector((state) => state.auth);

  //! Get Product Details from RTK QUERY---------------------------------------------------------------
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useGetProductDetailsQuery(productId);

  // Reviews from RTK QUERY
  const [createReview, {isLoading: loadingReview}] = useCreateReviewMutation();
  // Reviews from RTK QUERY
  const [deleteReview, {isLoading: loadingDelete}] = useDeleteReviewMutation();

  // ADD TO CART
  const addToCartHandler = () => {
    dispatch(addToCart({...product, qty})); //add product properties and quantity to the store
    navigate("/cart");
  };

  // Initialize selectedImage when product data is available
  if (product && !selectedImage) {
    setSelectedImage(product?.image[0]);
  }

  // handle image selection
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };
  // console.log(product);

  // Submit reviews-------------------------------------------------------
  const createReviewHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error("Please login to create a review");
    } else if (!comment || !rating) {
      toast.error("Please enter comment and rating");
    } else {
      try {
        await createReview({
          productId: product._id,
          comment,
          rating,
        }).unwrap();
        refetch();
        toast.success("Review submitted successfully");
        setComment("");
        setRating(0);
      } catch (error) {
        toast.error(error?.data?.message || error?.message);
      }
    }
  };

  // Delete Review
  // Inside your ProductScreen component
  const deleteReviewHandler = async (reviewId, rating) => {
    try {
      // Perform the deletion using RTK Query's mutation function
      await deleteReview({
        productId: product._id,
        reviewId,
        rating,
      }).unwrap();
      refetch(); // Refetch the product details to update the reviews
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  // console.log(product.reviews);
  return (
    <>
      {loadingReview && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Messages variant="danger">
          {isError?.data?.message || isError?.error}
        </Messages>
      ) : (
        <>
          <Meta title={product.name} />
          <Link className="btn btn-success my-3 mt-5 " to="/">
            ← Go Back
          </Link>
          <Row>
            <Col md={6} className="order-md-1 order-2 mt-3">
              <Image
                src={selectedImage}
                alt={product.name}
                fluid
                className="rounded-5"
              />
            </Col>
            <Col md={5} className="order-md-2 order-1 mt-4 rounded-3">
              <ListGroup variant="flush">
                <ListGroupItem>
                  <h3>{product.name}</h3>
                </ListGroupItem>
                <ListGroupItem>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Price:</strong> ${product.price}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Description:</strong> {product.description}
                </ListGroupItem>
              </ListGroup>

              <Col md={8} className="mt-3">
                <Card>
                  <ListGroup variant="flush">
                    <ListGroupItem>
                      <Row>
                        <Col>Price:</Col>
                        <Col>
                          <strong>${product.price}</strong>
                        </Col>
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </Col>
                      </Row>
                    </ListGroupItem>
                    {
                      /* Quantity */
                      product.countInStock > 0 && (
                        <ListGroupItem>
                          <Row>
                            <Col>Quantity:</Col>
                            <Col>
                              <FormControl
                                as="select"
                                value={qty}
                                onChange={(e) => Number(setQty(e.target.value))}
                              >
                                {[...Array(product.countInStock).keys()].map(
                                  (x) => (
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                  )
                                )}
                              </FormControl>
                            </Col>
                          </Row>
                        </ListGroupItem>
                      )
                    }
                    <ListGroupItem>
                      <Button
                        className="btn-danger color-white"
                        type="button"
                        disabled={product.countInStock === 0}
                        onClick={addToCartHandler}
                      >
                        🛒 Add To Cart
                      </Button>
                    </ListGroupItem>
                  </ListGroup>
                </Card>
              </Col>
            </Col>
          </Row>
          <Row className="my-2">
            {/* Render additional images */}
            {product.image &&
              product.image.map((img, index) => (
                <Col key={index} xs={6} sm={4} md={3} lg={2} className="mb-3">
                  <Image
                    src={img}
                    alt={`Product ${index + 1}`}
                    fluid
                    role="button"
                    style={{maxWidth: "100px"}}
                    className={`rounded-2 clickable-image ${
                      selectedImage === img ? "border border-secondary" : ""
                    }`}
                    onClick={() => handleImageClick(img)}
                  />
                </Col>
              ))}
          </Row>
          <Row className="review mt-4">
            <Col md={6}>
              <h4 className="my-3 text-success">Reviews</h4>
              {product.reviews.length === 0 && <Messages>No Reviews</Messages>}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroupItem key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>
                      {new Date(review.createdAt)
                        .toISOString()
                        .substring(0, 10)}
                    </p>

                    <p>{review.comment}</p>
                    {/* Render delete button for the review owner */}
                    {userInfo && userInfo.isAdmin && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          deleteReviewHandler(review._id, review.rating)
                        }
                      >
                        Delete
                      </Button>
                    )}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Col>

            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <h4 className="my-3 text-success">Write a Review</h4>
                  {loadingReview && <Loader />}
                  {userInfo ? (
                    <Form>
                      <Form.Group controlId="rating">
                        <Form.Label className="my-3 text-success">
                          Rating
                        </Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label className="my-3 text-success">
                          Comment
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </Form.Group>
                      <Button
                        onClick={createReviewHandler}
                        type="button"
                        variant="success"
                        className="my-3"
                        disabled={loadingReview}
                      >
                        Submit Review
                      </Button>
                    </Form>
                  ) : (
                    <Messages variant="danger">
                      Please <Link to="/login">sign in</Link> to write a review
                    </Messages>
                  )}
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
