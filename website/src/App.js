import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Coffee from "./pages/Coffee";
import logo from "./assets/plug.svg";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/coffee", label: "Buy me a coffee" },
];

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="nav">
          <div className="nav__brand">
            <img className="nav__logo" src={logo} alt="Unplugged Socials logo" />
            <span>Unplugged Socials</span>
          </div>
          <nav className="nav__links">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                className={({ isActive }) =>
                  `nav__link${isActive ? " nav__link--active" : ""}`
                }
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coffee" element={<Coffee />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>Unplugged Socials</p>
          <p>Keep your social media about being social.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
