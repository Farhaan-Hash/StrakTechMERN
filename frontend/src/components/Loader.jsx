import React from "react";
import MoonLoader from "react-spinners/MoonLoader";

const Loader = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center">
      <MoonLoader
        className="p-20"
        color="#1e7a68"
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
