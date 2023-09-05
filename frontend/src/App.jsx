// import {Container} from "react-bootstrap";
import {Outlet} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Header />
      <div className="container-xxl">
        <Outlet />
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
