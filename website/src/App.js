import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Coffee from "./pages/Coffee";
import Privacy from "./pages/Privacy";
import Support from "./pages/Support";
import logo from "./assets/icon.png";
import { NAV_LINKS, SITE } from "./config";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="nav">
          <div className="nav__brand">
            <img className="nav__logo" src={logo} alt="Unplugged Socials logo" />
            <span>{SITE.name}</span>
          </div>
          <nav className="nav__links">
            {NAV_LINKS.map((link) => (
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
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
