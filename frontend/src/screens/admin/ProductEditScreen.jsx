import React, {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Form, Button} from "react-bootstrap";
import Messages from "../../components/Messages";
import Loader from "../../components/Loader";
import {toast} from "react-toastify";
import FormContainer from "../../components/FormContainer";
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";

const ProductEditScreen = () => {
  const {id: productId} = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState([]);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  //match id with products to get the specific product
  const {
    data: product,
    isLoading,
    isError,
    // refetch,
  } = useGetProductDetailsQuery(productId);

  // Update Product
  const [updateProduct, {isLoading: loadingUpdate}] =
    useUpdateProductMutation();

  // Upload Image
  const [uploadImage, {isLoading: loadingUpload}] =
    useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  // Update Product handler
  const updateProductHandler = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      };
      const result = await updateProduct(updatedProduct);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Product Updated Successfully");
        navigate("/admin/productlist");
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  // Upload Image handler------------------------------------------------------

  const uploadImageHandler = async (e) => {
    const files = e.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    try {
      const res = await uploadImage(formData).unwrap();
      toast.success("Image uploaded successfully");
      setImage(res.images);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-success my-3 mt-4">
        Go Back
      </Link>
      <FormContainer>
        <h1 className="text-success my-2 text-center">Edit Product</h1>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Messages variant="danger">
            {isError?.data?.message || isError?.error}
          </Messages>
        ) : (
          <Form
            onSubmit={updateProductHandler}
            // method="POST"
            // enctype="multipart/form-data"
          >
            <Form.Group controlId="name">
              <Form.Label className="text-success">Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="price" className=" my-3">
              <Form.Label className="text-success">Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {/* IMAGE UPLOAD -------------------------------------------- */}
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                multiple
                label="Choose File"
                onChange={uploadImageHandler}
                type="file"
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand" className="my-3">
              <Form.Label className="text-success">Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="category" className="my-3">
              <Form.Label className="text-success">Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock" className="my-3">
              <Form.Label className="text-success">Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="description" className="my-3">
              <Form.Label className="text-success">Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
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

export default ProductEditScreen;
