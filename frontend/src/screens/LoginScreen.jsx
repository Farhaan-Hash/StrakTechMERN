import {useState, useEffect} from "react";
import FormContainer from "../components/FormContainer";
import {Form, Button, Row, Col} from "react-bootstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useLoginMutation} from "../slices/usersApiSlice";
import {setCredentials} from "../slices/authSlice";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../components/Loader";
import {toast} from "react-toastify";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  // createApi returns an array with two elements:
  // The first element (login in this case) is the mutation function itself. This function can be called to initiate the login mutation, which makes the API request.
  // The second element is an object that contains various properties related to the status of the mutation, such as whether it's loading (isLoading) or if an error occurred (isError).

  const [login, {isLoading}] = useLoginMutation();
  const {userInfo} = useSelector((state) => state.auth); //select state of the user login details if any

  const navigate = useNavigate();
  const {search} = useLocation(); // we want to get the query string from the url to check user logged in then redirect to shipping page.
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  useEffect(() => {
    //check if user already logged in or not
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({...res}));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message);
    }
    setEmail("");
    setPassword("");
  };

  return (
    <Row className="login-container mt-4">
      <Col
        md={6}
        className="d-none d-md-block login-image mt-md-2 img-fluid"
      ></Col>
      <Col md={6} className="login-form justify-content-center">
        <FormContainer>
          <h1 className="text-success">Sign In</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email" className="my-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button
              type="submit"
              variant="success"
              className="mt-3"
              disabled={isLoading}
            >
              Sign In
            </Button>
            {/* { login request is loading } */}
            {isLoading && <Loader />}
          </Form>
          <Row className="py-3">
            <Col>
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-danger text-decoration-underline"
              >
                Register here
              </Link>
            </Col>
          </Row>
        </FormContainer>
      </Col>
    </Row>
  );
};

export default LoginScreen;
