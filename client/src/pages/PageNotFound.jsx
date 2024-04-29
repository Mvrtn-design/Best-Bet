import React from "react";
import { Link } from "react-router-dom";
import Layout from "./partials/Layout";

function PageNotFound() {
  return (
    <Layout>
      <div>
        <h1>Page Not Found</h1>
        <p>Sorry, the page you are looking for could not be found.</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    </Layout>
  );
}
export default PageNotFound;
