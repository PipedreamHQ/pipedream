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
    "check-md",
    "tabs",
    ['vuepress-plugin-code-copy', {
      color: '#34d28b',
      backgroundColor: '#34d28b',
      backgroundTransition: false,
      successText: 'Copied'
    }]
  ],
  themeConfig,
  postcss: {
    plugins: [require("autoprefixer"), require("tailwindcss")],
  }
};
