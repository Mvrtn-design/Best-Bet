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
    title: "Partida",
    path: `/menu/:id}`,
    icon: <AiIcons.AiFillEnvironment />,
    cName: "nav-text",
  },
  {
    title: "Clubs",
    path: "/clubs",
    icon: <AiIcons.AiFillBug />,
    cName: "nav-text",
  },
  {
    title: "Bets",
    path: "/bets",
    icon: <AiIcons.AiFillMoneyCollect />,
    cName: "nav-text",
  },
  {
    title: "Competition",
    path: "/competition",
    icon: <AiIcons.AiFillCaretDown />,
    cName: "nav-text",
  },
  {
    title: "Amistoso",
    path: "/amistoso",
    icon: <AiIcons.AiOutlineShake />,
    cName: "nav-text",
  },
  {
    title: "Perfil",
    path: "/perfil",
    icon: <AiIcons.AiFillProfile />,
    cName: "nav-text",
  },
  {
    title: "Crear Post",
    path: "/createPost",
    icon: <AiIcons.AiFillAccountBook />,
    cName: "nav-text",
  },
];
