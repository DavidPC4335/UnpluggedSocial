import React from "react";
import logo from "../assets/plug.svg";

const PAYPAL_URL =
  "https://www.paypal.com/donate/?hosted_button_id=YOUR_PAYPAL_BUTTON_ID";

function Coffee() {
  return (
    <div className="coffee">
      <section className="section section--light">
        <div className="section__heading">
          <p className="eyebrow">Support the build</p>
          <h1>Buy me a coffee</h1>
          <p className="section__summary">
            Your support keeps Unplugged Socials fast, clean, and focused on the
            people you care about.
          </p>
        </div>
        <div className="coffee__content">
          <div className="coffee__card">
            <img src={logo} alt="Unplugged Socials logo" />
            <h3>Send a tip via PayPal</h3>
            <p>
              Every coffee helps cover hosting, feature development, and better
              experiences for the community.
            </p>
            <a className="button button--primary" href={PAYPAL_URL}>
              Open PayPal
            </a>
            <p className="coffee__note">
              Replace the PayPal link with your own hosted button ID.
            </p>
          </div>
          <div className="coffee__details">
            <h3>What your support enables</h3>
            <ul>
              <li>New ways to unplug without losing connection.</li>
              <li>Better accessibility and smoother browsing.</li>
              <li>Keeping the app ad-light and respectful.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Coffee;
