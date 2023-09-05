import {Alert} from "react-bootstrap";

const Messages = ({variant, children}) => {
  return <Alert variant={variant}>{children}</Alert>;
};

Messages.defaultProps = {
  variant: "danger",
};

export default Messages;
