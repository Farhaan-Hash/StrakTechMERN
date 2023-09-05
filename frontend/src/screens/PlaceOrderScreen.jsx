import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  ListGroupItem,
} from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
// import FormContainer from "../components/FormContainer";
import {useCreateOrderMutation} from "../slices/ordersApiSlice";
import {clearCartItems} from "../slices/cartSlice";
import {toast} from "react-toastify";
import Messages from "../components/Messages";
import Loader from "../components/Loader";
const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, {isLoading, isError}] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          qty: item.qty,
          price: item.price,
          image: item.image[0], // Use the first image URL
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res?._id}`);
    } catch (error) {
      toast.error(error?.res.message);
    }
  };

  // checkout steps--
  const steps = [
    {label: "Sign In", link: "/login"},
    {label: "Shipping", link: "/shipping"},
    {label: "Payment", link: "/payment"},
    {label: "Place Order", link: "/placeorder"},
  ];

  const currentStep = 3; // Set the current step index here (starting from 0)

  return (
    <>
      <CheckoutSteps steps={steps} currentStep={currentStep} />

      <Row>
        <Col
          className="mt-5 mb-5 p-5 bg-light  text-center col md-8 mx-auto rounded"
          md={8}
        >
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2 className="text-success font-weight-bold mb-3 text-center ">
                Shipping
              </h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2 className="text-success font-weight-bold mt-3 text-center ">
                Order Items
              </h2>
              {cart.cartItems.length === 0 ? (
                <Messages variant="info">Your cart is empty</Messages>
              ) : (
                <>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item className="p-3 " key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image[0]}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price.toFixed(2)} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col
          className="mt-5 mb-5 p-5 bg-light col md-4 text-center rounded mx-auto"
          md={4}
        >
          <>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2 className="text-success font-weight-bold mt-3 text-center  ">
                  Order Summary
                </h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart?.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart?.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart?.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart?.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroupItem>
                {isError && <Messages variant="danger">{isError}</Messages>}
              </ListGroupItem>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-success mt-2 w-100 btn-block font-weight-bold "
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
