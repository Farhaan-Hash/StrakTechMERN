import {Link, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Button,
  Card,
  ListGroupItem,
  FormControl,
} from "react-bootstrap";
import {FaTrash} from "react-icons/fa";
import Messages from "../components/Messages";
import {addToCart, removeFromCart} from "../slices/cartSlice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {cartItems} = useSelector((state) => state.cart);

  // Add Items to Cart

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({...product, qty}));
  };

  // Remove items from cart

  const removeCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  // Checkout

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 mt-5 pt-5 pb-5">
      <div>
        {cartItems.length !== 0 ? (
          <Link className="btn btn-success mb-3" to="/">
            ← Go Back
          </Link>
        ) : (
          ""
        )}
        <Row className="mt-5 text-center">
          <Col md={8}>
            <h1 className="mb-4 text-success">Shopping Cart</h1>
            {cartItems.length === 0 ? (
              <>
                <Messages>
                  <Link
                    to="/"
                    role="button"
                    className="bg-danger text-white p-2 m-4  rounded-2"
                  >
                    {" "}
                    ← Go Back{" "}
                  </Link>
                  <span className="text-danger">Your Cart is Empty!</span>
                </Messages>
                <div className="d-flex justify-content-center align-items-center vh-10">
                  <img src="/images/13.png" alt="cart" className="p-2" />
                </div>
              </>
            ) : (
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroupItem className="m-1 p-3" key={item._id}>
                    <Row>
                      <Col md={2}>
                        <Image
                          src={item.image[0]}
                          alt={item.name}
                          fluid
                          rounded
                        />
                      </Col>
                      <Col md={3}>
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                      </Col>
                      <Col md={2}>${item.price}</Col>
                      <Col md={2}>
                        <FormControl
                          as="select"
                          value={item.qty}
                          onChange={(e) =>
                            addToCartHandler(item, Number(e.target.value))
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </FormControl>
                      </Col>
                      <Col md={2}>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => removeCartHandler(item._id)}
                        >
                          <FaTrash />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </Col>

          {/* Price, total tax, shipping charges column-------------------------------------*/}
          {cartItems.length !== 0 && (
            <Col md={4} className=" my-5">
              <Card style={{marginBottom: "20px"}}>
                <ListGroup variant="flush">
                  <ListGroupItem className="m-3">
                    <h3 className="text-success">
                      Subtotal: ({cartItems.length}) items
                    </h3>{" "}
                    <strong className="text-success">Price to Pay: </strong>$
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </ListGroupItem>
                  <ListGroupItem>
                    <Button
                      type="button"
                      className="btn-block btn-success "
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                    >
                      Proceed To Checkout
                    </Button>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default CartScreen;
