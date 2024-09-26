export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the Lemin Puzzle task.",
    options: [
      "LeminTaskProxyless",
      "LeminTask",
    ],
    default: "LeminTaskProxyless",
    reloadProps: true,
  },
  websiteURL: {
    type: "string",
    label: "Website URL",
    description: "The full URL of target web page where the captcha is loaded. We do not open the page, not a problem if it is available only for authenticated users.",
  },
  captchaId: {
    type: "string",
    label: "Captcha Id",
    description: "Lemin **captchaId** value. Unique for a website.",
  },
  divId: {
    type: "string",
    label: "Div Id",
    description: "The **id** of captcha parent **div** element.",
  },
  leminApiServerSubdomain: {
    type: "string",
    label: "Lemin Api Server Subdomain",
    description: "API domain used to load the captcha scripts. Default: **https://api.leminnow.com/**.",
    optional: true,
  },
  userAgent: {
    type: "string",
    label: "User Agent",
    description: "User-Agent of your browser will be used to load the captcha. Use only modern browser's User-Agents.",
    optional: true,
  },
};
