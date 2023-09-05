import React, {useState} from "react";
import {LinkContainer} from "react-router-bootstrap";
import {Table, Button, Form} from "react-bootstrap";
import {FaTimes, FaTrash, FaEdit, FaCheck} from "react-icons/fa";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";
import Messages from "../../components/Messages";
import Loader from "../../components/Loader";
import {toast} from "react-toastify";

const UserListScreen = () => {
  const {data: users, isLoading, isError, refetch} = useGetUsersQuery();
  const [deleteUser, {isLoading: loadingDelete}] = useDeleteUserMutation();

  const [searchUser, setSearchUser] = useState(""); // State for user search

  // Check if orders data is available
  if (!users) {
    return <Loader />;
  }

  // Function to filter users based on searchUser
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  // Delete Handler User
  const deleteHandler = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        toast.success("User deleted");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error?.message);
      }
    }
  };

  return (
    <>
      <h2 className="text-dark  mb-4 mt-4 text-center">All Users List</h2>
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
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Messages variant="danger">
          {isError?.data?.message || isError?.error}
        </Messages>
      ) : (
        <>
          {filteredUsers.length === 0 ? (
            <Messages variant="danger">This user doesn't exist.</Messages>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover responsive className="table-sm">
                <thead>
                  <tr className="text-center text-uppercase font-weight-bold">
                    <th>ID</th>
                    <th>USER</th>
                    <th>Created on</th>
                    <th>EMAIL</th>
                    <th>ADMIN</th>
                    <th>EDIT / DELETE</th>
                  </tr>
                </thead>
                <tbody className=" text-center text-uppercase font-weight-bold">
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td className="text-secondary">{user.name}</td>
                      <td className="text-secondary">
                        {user.createdAt.substring(0, 10)}
                      </td>
                      <td className="text-secondary">
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      </td>
                      <td className="text-secondary">
                        {user.isAdmin ? (
                          <FaCheck
                            className="fas fa-check"
                            style={{color: "green"}}
                          />
                        ) : (
                          <FaTimes
                            className="fas fa-times"
                            style={{color: "red"}}
                          ></FaTimes>
                        )}
                      </td>
                      <td>
                        <LinkContainer to={`/admin/userlist/${user._id}/edit`}>
                          <Button
                            variant="success"
                            style={{marginRight: "10px"}}
                          >
                            <FaEdit
                              style={{color: "white", fontSize: "12px"}}
                            />
                          </Button>
                        </LinkContainer>
                        <Button
                          variant="danger"
                          style={{marginLeft: "10px"}}
                          onClick={() => deleteHandler(user._id)}
                        >
                          <FaTrash style={{color: "white", fontSize: "12px"}} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UserListScreen;
