import React, {useState, useEffect} from "react";
import {Form, Button, Row, Col} from "react-bootstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useRegisterMutation} from "../slices/usersApiSlice";
import {setCredentials} from "../slices/authSlice";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../components/Loader";
import {toast} from "react-toastify";
import FormContainer from "../components/FormContainer";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();
  const [register, {isLoading}] = useRegisterMutation();
  const {userInfo} = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const {search} = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.length < 8 || !isValidPassword(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters long and include numbers and special characters."
      );
    } else {
      setPasswordError("");
    }
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } else if (passwordError) {
      toast.error("Invalid password");
      return;
    }

    try {
      const res = await register({
        name,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({...res}));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message);
    }
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <Row className="login-container mt-4">
      <Col lg={6} className="d-none d-md-block login-image mt-md-2"></Col>
      <Col md={6} className="login-form">
        <FormContainer>
          <h1 className="text-success">Sign Up</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name" className="my-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="email" className="my-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={handlePasswordChange}
                isInvalid={passwordError || password !== confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {passwordError || "Passwords do not match"}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              type="submit"
              variant="success"
              className="mt-3"
              disabled={isLoading}
            >
              Register
            </Button>
            {isLoading && <Loader />}
          </Form>
          <Row className="py-3">
            <Col>
              Already have an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-danger text-decoration-underline"
              >
                Login here
              </Link>
            </Col>
          </Row>
        </FormContainer>
      </Col>
    </Row>
  );
};

export default RegisterScreen;
