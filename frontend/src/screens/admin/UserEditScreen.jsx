import React, {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Form, Button} from "react-bootstrap";
import Messages from "../../components/Messages";
import Loader from "../../components/Loader";
import {toast} from "react-toastify";
import FormContainer from "../../components/FormContainer";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";

const UserEditScreen = () => {
  const {id: userId} = useParams();

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isadmin, setIsAdmin] = useState(false);

  //match id with Users to get the specific product
  const {
    data: user,
    isLoading,
    isError,
    // refetch,
  } = useGetUserDetailsQuery(userId);

  // Update User
  const [updateUser, {isLoading: loadingUpdate}] = useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  // Update Product handler
  const updateUserHandler = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        _id: userId,
        name,
        email,
        isadmin,
      };
      const result = await updateUser(updatedUser);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("User Updated Successfully");
        navigate("/admin/userlist");
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-success my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1 className="text-success my-2 text-center">Edit User</h1>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Messages variant="danger">
            {isError?.data?.message || isError?.error}
          </Messages>
        ) : (
          <Form onSubmit={updateUserHandler}>
            <Form.Group controlId="name">
              <Form.Label className="text-success">Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label className="text-success">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="isadmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isadmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button className="mt-3 mb-4" type="submit" variant="success">
              Update
            </Button>
            {loadingUpdate && <Loader />}
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
