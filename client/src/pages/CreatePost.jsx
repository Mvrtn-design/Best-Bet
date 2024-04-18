import React from "react";
import { Field, Form, Formik } from "formik";
import axios from "axios";

// Replace the handleSave function with a Formik's onSubmit prop
const handleSave = async (values, { setSubmitting }) => {
  try {
    const response = await fetch("http://localhost:3001/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    console.log("Devuelto: ", await response.json());
    setSubmitting(false); // Set submitting to false when the request is successful
  } catch (error) {
    console.error("Error: ", error);
    setSubmitting(false); // Set submitting to false in case of an error
  }
};

const handleSearch = async (valuess, { setSubmitting }) => {
  try {
    const teamsResponse = await axios.get("http://localhost:3001/check", {
      params: {
        value: valuess,
      },
    });
    console.log("Teams Response: ", teamsResponse.data);
    setSubmitting(false); // Set submitting to false when the request is successful
  } catch (error) {
    console.error("Error: ", error);
    setSubmitting(false); // Set submitting to false in case of an error
  }
};

function CreatePost() {
  return (
    <div>
        <Formik initialValues={{ nombre: "", clave: "" }} onSubmit={handleSave}>
        {({ isSubmitting }) => (
          <Form>
            <label>
              Nombre:{" "}
              <Field type="text" name="nombre" placeholder="introduce name" />
            </label>
            <label>
              Clave: <Field type="password" name="clave" autoComplete="false" />
            </label>
            <button type="submit" disabled={isSubmitting}>
              BUSCAR
            </button>
          </Form>
        )}
      </Formik>
      <Formik initialValues={{ nombre: "", clave: "" }} onSubmit={handleSearch}>
        {({ isSubmitting }) => (
          <Form>
            <label>
              Nombre:{" "}
              <Field type="text" name="nombre" placeholder="introduce name" />
            </label>
            <label>
              Clave: <Field type="password" name="clave" autoComplete="false" />
            </label>
            <button type="submit" disabled={isSubmitting}>BUSCAR</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreatePost;
