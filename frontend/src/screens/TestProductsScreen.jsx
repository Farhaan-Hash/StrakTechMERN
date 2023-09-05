import React, {useState} from "react";
import {Col, Row, Form, Image} from "react-bootstrap";
import Product from "../components/Product";
import Messages from "../components/Messages";
import Loader from "../components/Loader";
import {Link, useParams} from "react-router-dom";
import {useGetSelectedProductsQuery} from "../slices/productsApiSlice";
import Paginate from "../components/Paginate";
import SearchBox from "../components/SearchBox";
import noProductsImage from "../assets/9..gif";

const TestProductsScreen = () => {
  const {keyword, pageNumber} = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    brand: "",
    minPrice: 0,
    maxPrice: Number.POSITIVE_INFINITY,
    minRating: 0,
  });
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortBy, setSortBy] = useState("price"); // Default sorting by price
  const [sortDirection, setSortDirection] = useState("asc"); // Default sorting direction

  const {data, isLoading, isError, refetch} = useGetSelectedProductsQuery({
    keyword,
    pageNumber,
  });

  // Sort products based on selected sorting criteria
  const sortedProducts = data?.products?.slice().sort((a, b) => {
    if (sortBy === "price") {
      // Sort by price
      const priceA = a.price;
      const priceB = b.price;
      return sortDirection === "asc" ? priceA - priceB : priceB - priceA;
    }
    // Add more sorting criteria as needed
    return 0;
  });

  // Filter products based on search and filters
  const filteredProducts = sortedProducts?.filter((product) => {
    // Filter by search query
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by brand
    if (selectedBrand && product.brand !== selectedBrand) {
      return false;
    }
    // Filter by price range
    const price = product.price;
    if (price < selectedFilters.minPrice || price > selectedFilters.maxPrice) {
      return false;
    }

    // Filter by minimum rating
    if (product.rating < selectedFilters.minRating) {
      return false;
    }

    return true;
  });

  //no Products found
  const noProductsFound = filteredProducts && filteredProducts.length === 0;

  const handleFilterChange = (filter, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: value,
    }));
    refetch();
  };
  return (
    <>
      {isLoading && <Loader />}
      {isError && <Messages error={isError} />}
      <Row className="mt-5 pb-4">
        <Col md={3}>
          <h4>Filters</h4>
          <Form className="mt-2 text-success">
            <Form.Group controlId="brand">
              <Form.Label className="mt-2 text-success">Brand</Form.Label>
              <Form.Control
                as="select"
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  // handleFilterChange("brand", e.target.value);
                }}
              >
                <option value="">All Brands</option>
                <option value="Apple">Apple</option>
                <option value="Amazon">Amazon</option>
                <option value="Cannon">Cannon</option>
                <option value="AMD">AMD</option>
                <option value="Sony">Sony</option>
                <option value="Logitech">Logitech</option>
              </Form.Control>
            </Form.Group>

            {/* Sort by dropdown */}
            <div className=" mt-2">
              <Form.Group controlId="sortDirectionSelect">
                <Form.Label className="mt-2 text-success">Sort</Form.Label>
                <Form.Control
                  as="select"
                  value={sortDirection}
                  onChange={(e) => setSortDirection(e.target.value)}
                >
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </Form.Control>
              </Form.Group>
            </div>

            <Form.Group>
              <Form.Label className="mt-2 text-success">Price Range</Form.Label>
              <Form.Control
                type="number"
                placeholder="Min Price"
                value={selectedFilters.minPrice}
                onChange={(e) =>
                  handleFilterChange("minPrice", Number(e.target.value))
                }
              />
              <Form.Control
                type="number"
                placeholder="Max Price"
                value={selectedFilters.maxPrice}
                onChange={(e) =>
                  handleFilterChange("maxPrice", Number(e.target.value))
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="mt-2 text-success">
                Minimum Rating
              </Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={selectedFilters.minRating}
                onChange={(e) =>
                  handleFilterChange("minRating", Number(e.target.value))
                }
              />
            </Form.Group>
          </Form>
        </Col>
        <Col md={9}>
          <h3 className="mt-4 text-success text-center">Search Products</h3>
          <SearchBox />

          <>
            {noProductsFound ? (
              <div className="text-center mt-5">
                <Link to={`/selected`} className="btn btn-success btn-sm mb-3">
                  Go Back
                </Link>
                <h4 className="text-danger">
                  No products found for the search query.
                </h4>
                <Image
                  src={noProductsImage}
                  alt="No products found"
                  fluid
                  width={270}
                  height={250}
                />
              </div>
            ) : (
              <>
                {keyword && (
                  <Link
                    to={`/selected`}
                    className="btn btn-success btn-sm mt-4"
                  >
                    Go Back
                  </Link>
                )}

                <Row>
                  {filteredProducts?.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                      <Product product={product} />
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </>
        </Col>
      </Row>
      <Paginate
        pages={data?.pages}
        page={data?.page}
        keyword={keyword ? keyword : ""}
      />
    </>
  );
};

export default TestProductsScreen;
