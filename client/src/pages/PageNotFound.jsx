import React from "react";
import { Link } from "react-router-dom";
import Layout from "./partials/Layout";

function PageNotFound() {
  return (
    <Layout>
      <div>
        <h1>404, Page Not Found</h1>
        <p>Lo sentimos, la página que busca no existe</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    </Layout>
  );
}
export default PageNotFound;
