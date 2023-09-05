import React from "react";
import {Row, Col} from "react-bootstrap";
import Product from "../components/Product";
import {useGetProductsQuery} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Messages from "../components/Messages";
import HomeBanner from "../components/HomeBanner";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";

// import products from "../products";
// import axios from "axios";

const HomeScreen = () => {
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const {data} = await axios.get("/api/products");
  //       setProducts(data);
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  //! Get Products from RTK QUERY---------------------------------------------------------------
  const {data: products, isLoading, isError} = useGetProductsQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Messages variant="danger">
          {isError?.data?.message || isError?.error}
        </Messages>
      ) : (
        <>
          <Meta title={"StarkTech"} />
          <ProductCarousel />

          <div className="slide-in-fwd-center pt-1">
            <h1 className="text-success mt-3 text-center">Latest Products</h1>
            <Row>
              {products.map((product) => {
                // Using the parent image from the `image` array as the main image-------------------------
                const mainImage = product.image[0];
                console.log(mainImage);
                return (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    {/* Passing the mainImage prop to the Product component------------------------------- */}
                    <Product product={product} mainImage={mainImage} />
                  </Col>
                );
              })}
            </Row>
            <div>
              <HomeBanner />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HomeScreen;
