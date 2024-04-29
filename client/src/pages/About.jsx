import React from 'react';
import { AiFillBackward } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Layout from "./partials/Layout";


function About() {
  const navigate = useNavigate();
  return (
    <Layout>
      <button className="back-button" onClick={() => navigate(-1)}><AiFillBackward /> Volver</button>
    <div>
      <h1>Acerca de nuestra aplicación</h1>
      <p>
        Our app is a cutting-edge tool that helps users manage their tasks and to-do lists with ease. With a sleek and intuitive interface, users can quickly add, edit, and delete tasks, as well as set reminders and due dates.
      </p>
      <p>
        Our app is built using the latest technologies, including React and Redux, and is designed to be fast, reliable, and easy to use. We are constantly updating and improving the app to add new features and enhance the user experience.
      </p>
      <p>
        We believe that our app is the perfect tool for anyone looking to stay organized and on top of their tasks. Whether you're a busy professional, a student, or just someone who wants to keep track of their to-do list, our app has you covered.
      </p>
    </div>
    </Layout>
  )
}

export default About;