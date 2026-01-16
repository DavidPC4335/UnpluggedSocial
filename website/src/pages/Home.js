import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/plug.svg";

const landingConfig = {
  title: "Unplugged Socials",
  subtitlePrefix: "Keep your ",
  subtitleAccent: "social media",
  subtitleSuffix: " about being social.",
  ctas: [
    {
      label: "Open Instagram",
      href: "https://www.instagram.com/",
      primary: true,
    },
    {
      label: "Buy me a coffee",
      href: "/coffee",
      primary: false,
    },
  ],
  features: [
    {
      title: "Stay connected",
      text: "Stay connected with friends and accounts you follow.",
    },
    {
      title: "Protect your time",
      text: "Be present and protect your time from endless scrolling.",
    },
    {
      title: "Cleaner feeds",
      text: "No extra ads, or retention hacking content.",
    },
  ],
  info: [
    {
      text: "Shake your phone to bring up the unplugged menu.",
    },
  ],
  disclaimer:
    "This app is not affiliated with Instagram, Facebook, or TikTok. It is a third-party app blocker that allows you to browse these platforms.",
};

function Home() {
  return (
    <div>
      <section className="hero">
        <div className="hero__content">
          <div className="hero__badge">unpluggedsocials.com</div>
          <h1>{landingConfig.title}</h1>
          <p className="hero__subtitle">
            {landingConfig.subtitlePrefix}
            <span className="hero__accent">{landingConfig.subtitleAccent}</span>
            {landingConfig.subtitleSuffix}
          </p>
          <div className="hero__cta">
            {landingConfig.ctas.map((cta) => {
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
          {landingConfig.features.map((feature) => (
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
          {landingConfig.info.map((item) => (
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
        <p>{landingConfig.disclaimer}</p>
      </section>
    </div>
  );
}

export default Home;
