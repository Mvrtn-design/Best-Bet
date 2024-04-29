import React from "react";
import { AiFillHome, AiFillBackward, AiFillProfile, AiOutlineUser } from "react-icons/ai";

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Clubs",
    path: "/clubs",
    icon: <AiFillProfile />,
    cName: "nav-text",
  },
  {
    title: "Amistoso",
    path: "/match",
    icon: <AiFillBackward />,
    cName: "nav-text",
  },
  {
    title: "Perfil",
    path: "/profile",
    icon: <AiOutlineUser />,
    cName: "nav-text",
  },
];
