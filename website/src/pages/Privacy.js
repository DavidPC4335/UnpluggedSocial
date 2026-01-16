import React from "react";

function Privacy() {
  return (
    <div className="privacy">
      <section className="section section--light">
        <div className="section__heading">
          <p className="eyebrow">Privacy policy</p>
          <h1>Privacy policy</h1>
          <p className="section__summary">
            This privacy policy explains how Unplugged Socials handles
            information and what responsibilities you accept when using the app.
          </p>
        </div>
        <div className="card card--highlight">
          <h3>Data collection</h3>
          <p>
            Unplugged Socials does not collect, store, or sell personal data. We
            do not run analytics, tracking pixels, or advertising identifiers,
            and we do not create user profiles.
          </p>
        </div>
        <div className="card card--highlight">
          <h3>Third-party platforms</h3>
          <p>
            This app is a third-party tool that interacts with social media
            platforms. We are not affiliated with any social media company and
            cannot control how those platforms operate.
          </p>
        </div>
        <div className="card card--highlight">
          <h3>Use at your own risk</h3>
          <p>
            By using Unplugged Socials, you accept full responsibility for any
            outcomes, including account restrictions, platform policy changes,
            content availability, or service interruptions. We are not
            responsible for any repercussions from social media sites.
          </p>
        </div>
        <div className="card card--highlight">
          <h3>Security and availability</h3>
          <p>
            We aim to keep the app reliable and secure, but we make no guarantees
            that the service will always be available, uninterrupted, or error
            free.
          </p>
        </div>
        <div className="card card--highlight">
          <h3>Updates</h3>
          <p>
            We may update this privacy policy to reflect changes to the app or
            legal requirements. Continued use of the app means you accept the
            updated policy.
          </p>
        </div>
        <div className="card card--highlight">
          <h3>Support</h3>
          <p>
            For help or support, email{" "}
            <a href="mailto:support@unplugedsocials.com">
              support@unplugedsocials.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

export default Privacy;
