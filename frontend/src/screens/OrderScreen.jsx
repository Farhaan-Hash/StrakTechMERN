import React, {useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Image,
  Card,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {useSelector} from "react-redux";
import Messages from "../components/Messages";

import Loader from "../components/Loader";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
import {toast} from "react-toastify";

const OrderScreen = () => {
  const {id: orderId} = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    isError,
  } = useGetOrderDetailsQuery(orderId);

  // PAYPAL
  const [payOrder, {isLoading: isPayLoading}] = usePayOrderMutation();

  const [deliverOrder, {isLoading: isDeliverLoading}] =
    useDeliverOrderMutation();

  const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    isError: isErrorPayPal,
  } = useGetPayPalClientIdQuery();

  const {userInfo} = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isErrorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({type: "setLoadingStatus", value: "pending"});
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [isErrorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({
          orderId,
          details,
        });
        refetch(); //to see change notPaid to Paid
        toast.success("Order Paid");
      } catch (error) {
        toast.error(error?.data?.message || error?.message);
      }
    });
  };
  const onError = (error) => {
    toast.error(error?.data?.message || error?.message);
  };

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };
  // Handler for Mark as Delivered-------------------------
  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      toast.success("Order Delivered");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Messages variant="danger">
      {isError?.data?.message || isError?.error}
    </Messages>
  ) : (
    <>
      <Row className="mt-4">
        <Col md={7}>
          <Card className="mb-3 bg-light shadow p-3 rounded border-0">
            <Card.Body>
              <h3 className="text-success">Shipping</h3>
              <p>
                <strong>Name:</strong> {order.user.name}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                , {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Messages variant="success">
                  Delivered on {order.deliveredAt}
                </Messages>
              ) : (
                <Messages variant="danger">Not Delivered</Messages>
              )}
              <hr />
              <h3 className="mb-3 text-success">Payment Mode</h3>
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Messages variant="success">Paid on {order.paidAt}</Messages>
              ) : (
                <Messages variant="danger">Not Paid</Messages>
              )}
              <p>
                <strong>Payment Date:</strong>{" "}
                {order.createdAt.substring(0, 10)}
              </p>
            </Card.Body>
          </Card>

          <Card className="mb-3 bg-light shadow p-3 rounded border-0">
            <Card.Body>
              <h3 className="text-success">Order Items</h3>
              {order.orderItems.length === 0 ? (
                <Messages variant="info">Order is empty</Messages>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row className="p-2">
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link
                            className="text-success"
                            to={`/product/${item.product}`}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <h4 className="text-success mt-2">Order Summary</h4>
                </ListGroupItem>
                <ListGroupItem className=" p-4 m-4 bg-light shadow rounded ">
                  <Row>
                    <Col className="text-success mt-1">Items:</Col>
                    <Col>${order.itemsPrice}</Col>
                  </Row>
                  <Row>
                    <Col className="text-success mt-1">Shipping:</Col>
                    <Col>${order.shippingPrice}</Col>
                  </Row>
                  <Row>
                    <Col className="text-success mt-1">Tax:</Col>
                    <Col>${order.taxPrice}</Col>
                  </Row>
                  <Row>
                    <Col className="text-success mt-1">Total:</Col>
                    <Col>${order.totalPrice}</Col>
                  </Row>
                </ListGroupItem>
                {/* {Pay Order PLACEHOLDER} */}
                {!order.isPaid && (
                  <ListGroupItem>
                    {isPayLoading && <Loader />}
                    {isPending ? (
                      <Loader />
                    ) : (
                      <div>
                        {/*For testing purpose only 
                         <Button
                          style={{marginBottom: "10px"}}
                          onClick={onApproveTest}
                        >
                          Test Pay Order
                        </Button> */}

                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          >
                            Paypal
                          </PayPalButtons>
                        </div>
                      </div>
                    )}
                  </ListGroupItem>
                )}
                {/* {MARK AS DELIVERED PLACEHOLDER} */}
                {isDeliverLoading && <Loader />}
                {userInfo &&
                  userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered && (
                    <ListGroupItem>
                      <div className="text-center btn-block">
                        <Button
                          type="button"
                          onClick={deliverOrderHandler}
                          variant="success"
                          disabled={isDeliverLoading}
                        >
                          Mark As Delivered
                        </Button>
                      </div>
                    </ListGroupItem>
                  )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
