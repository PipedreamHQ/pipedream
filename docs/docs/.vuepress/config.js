const path = require("path");
const webpack = require("webpack");
const themeConfig = require("./configs/themeConfig");

module.exports = {
  title: "",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ['meta', { name: 'version', content: 'latest' }]
  ],
  description: "Pipedream Documentation - Connect APIs, remarkably fast",
  base: "/docs/",
  plugins: [
    [
      "vuepress-plugin-canonical",
      {
        baseURL: "https://pipedream.com/docs", // base url for your canonical link, optional, default: ''
        stripExtension: true,
      },
    ],
  ],
  themeConfig,
  postcss: {
    plugins: [require("autoprefixer"), require("tailwindcss")],
  }
};
