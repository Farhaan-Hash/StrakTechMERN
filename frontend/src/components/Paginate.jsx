import {Pagination} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

const Paginate = ({pages, page, isAdmin = false, keyword = ""}) => {
  return (
    pages > 1 && (
      <Pagination className="justify-content-center mt-5 ">
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1} //starts at index 1 not at 0
            to={
              !isAdmin
                ? keyword
                  ? `/selected/search/${keyword}/page/${x + 1}`
                  : `/selected/page/${x + 1}`
                : `/admin/productlist/${x + 1}`
            }
            style={{color: x + 1 === page ? "red" : "black"}}
          >
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
