import React from "react";

function Support() {
  return (
    <div className="support">
      <section className="section section--light">
        <div className="section__heading">
          <p className="eyebrow">Get help</p>
          <h1>Support</h1>
          <p className="section__summary">
            Need help with Unplugged Socials? We're here to assist you.
          </p>
        </div>
        <div className="card card--highlight">
          <h3>Contact us</h3>
          <p>
            For support, questions, or feedback, please email us at{" "}
            <a href="mailto:support@unpluggedsocials.com">
              support@unpluggedsocials.com
            </a>
          </p>
          <p style={{ marginTop: "1rem" }}>
            We typically respond within 24-48 hours.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Support;
