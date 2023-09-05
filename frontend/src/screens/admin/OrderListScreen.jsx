import React, {useState} from "react";
import {LinkContainer} from "react-router-bootstrap";
import {Table, Button, Form} from "react-bootstrap";
import {FaTimes} from "react-icons/fa";
import {useGetOrdersQuery} from "../../slices/ordersApiSlice";
import Messages from "../../components/Messages";
import Loader from "../../components/Loader";

const OrderListScreen = () => {
  const {data: orders, isLoading, isError} = useGetOrdersQuery();

  const [searchUser, setSearchUser] = useState(""); // State for user search

  // Check if orders data is available
  if (!orders) {
    return <Loader />;
  }
  // Filter orders based on user search
  const filteredOrders = orders.filter(
    (order) =>
      order.user &&
      order.user.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <>
      <h2 className="text-dark mt-4  mb-4  text-center">
        All Users Order List
      </h2>
      <Form>
        <Form.Group controlId="searchUser">
          <Form.Label className="mt-3 mb-2 text-dark ">
            Search User by Name:
            <Form.Control
              className=" mb-2 text-success"
              type="text"
              placeholder="Enter user name"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </Form.Label>
        </Form.Group>
      </Form>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Messages variant="danger">
          {isError?.data?.message || isError?.error}
        </Messages>
      ) : (
        <>
          {filteredOrders.length === 0 ? (
            <Messages variant="danger">This user doesn't exist.</Messages>
          ) : (
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr className="text-center text-uppercase font-weight-bold">
                  <th>ID</th>
                  <th>USER</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className=" text-center text-uppercase font-weight-bold">
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td className="text-secondary">
                      {order.user && order.user.name}
                    </td>
                    <td className="text-secondary">
                      {order.createdAt.substring(0, 10)}
                    </td>
                    <td className="text-secondary">${order.totalPrice}</td>
                    <td className="text-secondary">
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <FaTimes
                          className="fas fa-times"
                          style={{color: "red"}}
                        ></FaTimes>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <FaTimes
                          className="fas fa-times"
                          style={{color: "red"}}
                        ></FaTimes>
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button
                          variant="light"
                          className="btn-sm text-white bg-success"
                        >
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </>
  );
};

export default OrderListScreen;
