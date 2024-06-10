import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as Falcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import { IconContext } from 'react-icons'

function Navbar() {
  const [sidebar, setsidebar] = useState(false);

  const showSidebar = () => setsidebar(!sidebar);

  const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
  }

  const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "claro");
  }
  const toggleTheme = (e) => {
    if (e.target.checked) setLightMode();
    else if (!e.target.checked) setDarkMode();
  }

  return (
    <div>
      <IconContext.Provider value={{ color: 'green' }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <Falcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <div>
                <Falcons.FaLightbulb/>  MODO CLARO 
                <input
                  className="dark-mode-input"
                  type="checkbox"
                  id="darkmode-toggle"
                  onChange={toggleTheme} />
              </div>
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </div>
  );
}

export default Navbar;
