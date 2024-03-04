/** @type {import('next').NextConfig} */
const withFonts = require("next-fonts");

module.exports = withFonts({
  webpack(config, options) {
    return config;
  },
});
module.exports = {
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};
