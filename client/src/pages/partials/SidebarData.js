import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Falcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";


export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Clubs",
    path: "/clubs",
    icon: <AiIcons.AiFillProfile />,
    cName: "nav-text",
  },
  {
    title: "Competition",
    path: "/competition",
    icon: <AiIcons.AiFillContacts />,
    cName: "nav-text",
  },
  {
    title: "Amistoso",
    path: "/match",
    icon: <AiIcons.AiFillBackward />,
    cName: "nav-text",
  },
  {
    title: "Perfil",
    path: "/perfil",
    icon: <AiIcons.AiOutlineUser />,
    cName: "nav-text",
  },
];
