import {Image, Badge, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {FaShoppingCart, FaUserCircle} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import image from "../assets/3.png";
import "../index.css";
import {useLogoutMutation} from "../slices/usersApiSlice";
import {logout} from "../slices/authSlice";
import {useDispatch, useSelector} from "react-redux";
import {resetCart} from "../slices/cartSlice";

const Header = () => {
  const navigate = useNavigate();
  const {cartItems} = useSelector((state) => state.cart);
  const {userInfo} = useSelector((state) => state.auth); // User Profile
  const dispatch = useDispatch();

  const [logoutApiCall] = useLogoutMutation(); // Destructure access 1st item

  const LogoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header>
      <Navbar
        bg="light"
        variant="light"
        expand="md"
        collapseOnSelect
        className="text-white"
      >
        <LinkContainer to="/">
          <Navbar.Brand>
            <Image src={image} alt="logo" width={55} height={47} /> StarkTech
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/selected">
              <Nav.Link>Products</Nav.Link>
            </LinkContainer>
            {/* <LinkContainer to="/products">
              <Nav.Link>ClientSide Products</Nav.Link>
            </LinkContainer> */}
            <LinkContainer to="/cart">
              <Nav.Link>
                <FaShoppingCart />
                {"  "}Cart
                {cartItems.length > 0 && (
                  <Badge pill bg="danger" style={{marginLeft: "3px"}}>
                    {cartItems.length}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>
            {userInfo ? (
              <NavDropdown title={userInfo.name} id="username">
                <LinkContainer to="/profile">
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={LogoutHandler}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link href="/login">
                  <FaUserCircle /> Sign In
                </Nav.Link>
              </LinkContainer>
            )}
            {userInfo && userInfo.isAdmin && (
              <NavDropdown
                title="Admin"
                id="adminmenu"
                className="dropdown admin-dropdown"
              >
                <LinkContainer to="/admin/productlist">
                  <NavDropdown.Item>Products</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/userlist">
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/orderlist">
                  <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={LogoutHandler}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default Header;
