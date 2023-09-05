import React, {useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useParams, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const SearchBox = () => {
  const navigate = useNavigate();
  const {keyword: urlKeyword} = useParams();

  const [keyword, setKeyword] = useState(urlKeyword || "");
  const [isEmpty, setIsEmpty] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/selected/search/${keyword}`);
      setKeyword("");
    } else {
      // If input is empty, show a toast notification
      setIsEmpty(true);
      toast.error("Please enter a keyword to search.");

      // Navigate to the default route ("/selected") when clearing the search
      navigate("/selected");
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex mx-auto">
      <Form.Control
        type="text"
        name="q"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setIsEmpty(false);
        }}
        placeholder="Search products..."
        className="mr-sm-2 ml-sm-5"
      />
      <Button type="submit" variant="success" className="p-2 mx-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
