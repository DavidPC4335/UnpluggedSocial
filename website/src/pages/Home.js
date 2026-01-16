import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/icon.png";
import { HOME } from "../config";

function Home() {
  return (
    <div>
      <section className="hero">
        <div className="hero__content">
          <div className="hero__badge">unpluggedsocials.com</div>
          <h1>{HOME.title}</h1>
          <p className="hero__subtitle">
            {HOME.subtitlePrefix}
            <span className="hero__accent">{HOME.subtitleAccent}</span>
            {HOME.subtitleSuffix}
          </p>
          <div className="hero__cta">
            {HOME.ctas.map((cta) => {
              const className = `button${cta.primary ? " button--primary" : ""}`;
              if (cta.href.startsWith("/")) {
                return (
                  <Link key={cta.label} className={className} to={cta.href}>
                    {cta.label}
                  </Link>
                );
              }
              return (
                <a key={cta.label} className={className} href={cta.href}>
                  {cta.label}
                </a>
              );
            })}
          </div>
          <p className="hero__note">
            Minimal, focused, and built to keep you connected without the noise.
          </p>
        </div>
        <div className="hero__visual">
          <div className="logo-card">
            <img src={logo} alt="Unplugged Socials logo" />
          </div>
          <div className="hero__rings" />
        </div>
      </section>

      <section className="section section--light" id="features">
        <div className="section__heading">
          <p className="eyebrow">Why Unplugged Socials</p>
          <h2>Social media that feels human again.</h2>
          <p className="section__summary">
            Built for focus, connection, and simplicity, Unplugged Socials strips
            away the noise so you can stay present.
          </p>
        </div>
        <div className="grid">
          {HOME.features.map((feature) => (
            <div className="card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__heading">
          <p className="eyebrow">Quick tips</p>
          <h2>Designed for mindful browsing.</h2>
        </div>
        <div className="grid grid--single">
          {HOME.info.map((item) => (
            <div className="card card--highlight" key={item.text}>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--light">
        <div className="section__heading">
          <p className="eyebrow">Brand promise</p>
          <h2>Calm, confident, and clean.</h2>
          <p className="section__summary">
            Unplugged Socials is designed to feel as intentional as the moments
            you want to protect. Keep your feed focused and your time yours.
          </p>
        </div>
        <div className="stats">
          <div>
            <h3>Simple</h3>
            <p>Only what you need, nothing you do not.</p>
          </div>
          <div>
            <h3>Respectful</h3>
            <p>Built without retention tricks or manipulative content loops.</p>
          </div>
          <div>
            <h3>Supportive</h3>
            <p>Encourages healthier habits with easy in-app controls.</p>
          </div>
        </div>
      </section>

      <section className="section section--disclaimer">
        <p>{HOME.disclaimer}</p>
      </section>
    </div>
  );
}

export default Home;
