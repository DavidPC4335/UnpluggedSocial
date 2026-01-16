export const SITE = {
  name: "Unplugged Socials",
  tagline: "Keep your social media about being social.",
};

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/coffee", label: "Buy me a coffee" },
];

export const DONATION = {
  paypalUrl:
    "https://www.paypal.com/qrcodes/managed/44e08648-2e66-4158-8f0d-7b00e882ccab?utm_source=consweb_more",
  eyebrow: "Support the build",
  title: "Buy me a coffee",
  summary:
    "Your support keeps Unplugged Socials fast, clean, and focused on the people you care about.",
  cardTitle: "Send a tip via PayPal",
  cardBody:
    "Every donation helps cover costs, feature development, and better experiences for the community.",
  buttonLabel: "Open PayPal",
  qrLabel: "Scan to donate",
  detailsTitle: "What your support enables",
  details: [
    "New ways to unplug without losing connection.",
    "Better accessibility and smoother browsing.",
    "Keeping the app ad-light and respectful.",
    "Supporting the development of new features and improvements.",
  ],
};

export const HOME = {
  title: "Unplugged Socials",
  subtitlePrefix: "Keep your ",
  subtitleAccent: "social media",
  subtitleSuffix: " about being social.",
  ctas: [
    {
      label: "App Store",
      href: "https://apps.apple.com/app/id6783458066",
      primary: true,
    },
    {
      label: "Google Play",
      href: "https://apps.apple.com/app/id6783458066",
      primary: true,
    },
    {
      label: "Support the project",
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
      text: "Unplugged is an opensource application that blocks the distractions and keeps you focused on the things that matter.",
    },
  ],
  disclaimer:
    "This app is not affiliated with Instagram, Facebook, or TikTok. It is a third-party app blocker that allows you to browse these platforms.",
};
