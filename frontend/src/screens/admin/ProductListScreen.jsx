import React from "react";
import {
  useCreateProductMutation,
  useGetSelectedProductsQuery,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import {LinkContainer} from "react-router-bootstrap";
import {Table, Button, Row, Col} from "react-bootstrap";
import {FaEdit, FaTrash} from "react-icons/fa";
import Messages from "../../components/Messages";
import Loader from "../../components/Loader";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {
  const {pageNumber} = useParams();
  const {data, isLoading, isError, refetch} = useGetSelectedProductsQuery({
    pageNumber,
  }); // console.log(products);

  const [createProduct, {isLoading: loadingCreate}] =
    useCreateProductMutation();

  const [deleteProduct, {isLoading: loadingDelete}] =
    useDeleteProductMutation();

  // Create Product handler
  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct({});
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error?.message);
      }
    }
  };

  // Delete Products handler
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error?.message);
      }
    } else {
      return;
    }
  };

  return (
    <>
      <Row className="mt-4">
        <Col>
          <h2 className="text-success ">Products</h2>
        </Col>
        <Col className="text-end">
          <Button
            className="btn-sm m-3 btn-success"
            onClick={createProductHandler}
          >
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Messages variant="danger">
          {isError?.data?.message || isError?.error}
        </Messages>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr className="text-center">
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="text-center">
              {data?.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => {
                        deleteHandler(product._id);
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate page={data?.page} pages={data?.pages} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
