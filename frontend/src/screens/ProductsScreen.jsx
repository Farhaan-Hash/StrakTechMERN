import React, {useState, useEffect} from "react";
import {Row, Col, Form, Button} from "react-bootstrap";
import Product from "../components/Product";
import {useGetProductsQuery} from "../slices/productsApiSlice";
import Loader from "../components/Loader";

const ProductsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    brand: "",
    minPrice: 0,
    maxPrice: Number.POSITIVE_INFINITY,
    minRating: 0,
  });
  const [selectedBrand, setSelectedBrand] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4; // Show 4 products per page

  // const {data, isLoading} = useGetSelectedProductsQuery();
  const {data: products, isLoading} = useGetProductsQuery();

  const filteredProducts = products?.filter((product) => {
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

  const totalFilteredProducts = filteredProducts?.length;
  const totalPages = Math.ceil(totalFilteredProducts / productsPerPage);

  // Ensure the current page is within valid bounds after filtering
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayedProducts = filteredProducts
    ? filteredProducts.slice(startIndex, endIndex)
    : [];

  const handleFilterChange = (filter, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: value,
    }));
    setCurrentPage(1); // Reset to the first page when filters change
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      {isLoading && <Loader />}
      <Row className="mt-5">
        <Col md={3}>
          <h4>Filters</h4>
          <Form>
            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
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

            <Form.Group>
              <Form.Label>Price Range</Form.Label>
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
              <Form.Label>Minimum Rating</Form.Label>
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
          <Form.Control
            type="text"
            placeholder="Search Products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <>
            <Row className="mt-3">
              {displayedProducts.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
            <div className="pagination">
              {Array.from({length: totalPages}).map((_, index) => (
                <Button
                  key={index + 1}
                  onClick={() => onPageChange(index + 1)}
                  className={
                    currentPage === index + 1
                      ? index + 1 === 1 || index + 1 >= 2
                        ? "active btn btn-success mx-1  rounded"
                        : "active btn btn-info"
                      : ""
                  }
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </>
        </Col>
      </Row>
    </>
  );
};

export default ProductsScreen;
