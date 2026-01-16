import React from "react";
import logo from "../assets/plug.svg";
import donationQrCode from "../assets/donationQRCode.png";
import paypalLogo from "../assets/paypal.png";
import { DONATION } from "../config";

function Coffee() {
  return (
    <div className="coffee">
      <section className="section section--light">
        <div className="section__heading">
          <p className="eyebrow">{DONATION.eyebrow}</p>
          <h1>{DONATION.title}</h1>
          <p className="section__summary">
            {DONATION.summary}
          </p>
        </div>
        <div className="coffee__content">
          <div className="coffee__support">
            <div className="coffee__card">
              <img src={logo} alt="Unplugged Socials logo" />
              <h3>{DONATION.cardTitle}</h3>
              <p>{DONATION.cardBody}</p>
              <div className="coffee__actions">
                <a
                  className="button button--primary coffee__paypal"
                  href={DONATION.paypalUrl}
                >
                  <img
                    className="coffee__paypal-icon"
                    src={paypalLogo}
                    alt="PayPal"
                  />
                  {DONATION.buttonLabel}
                </a>
              </div>
            </div>
            <div className="coffee__qr" aria-hidden="true">
              <p className="coffee__qr-label">{DONATION.qrLabel}</p>
              <img src={donationQrCode} alt="" />
            </div>
          </div>
          <div className="coffee__details">
            <h3>{DONATION.detailsTitle}</h3>
            <ul>
              {DONATION.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Coffee;
