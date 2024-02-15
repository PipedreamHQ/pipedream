export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the GeeTest task.",
    options: [
      "GeeTestTaskProxyless",
      "GeeTestTask",
    ],
    default: "GeeTestTaskProxyless",
    reloadProps: true,
  },
  websiteURL: {
    type: "string",
    label: "Website URL",
    description: "The full URL of target web page where the captcha is loaded. We do not open the page, not a problem if it is available only for authenticated users.",
  },
  gt: {
    type: "string",
    label: "GT",
    description: "GeeTest **gt** value.",
  },
  challenge: {
    type: "string",
    label: "Challenge",
    description: "GeeTest **challenge** value.",
  },
  userAgent: {
    type: "string",
    label: "User Agent",
    description: "User-Agent of your browser will be used to load the captcha. Use only modern browser's User-Agents.",
    optional: true,
  },
  version: {
    type: "string",
    label: "Version",
    description: "GeeTest version.",
    options: [
      "3",
      "4",
    ],
    default: "3",
    reloadProps: true,
  },
  initParameters: {
    type: "string",
    label: "Init Parameter",
    description: "Captcha parameters passed to **initGeetest4** call, must contain **captcha_id** value, for example: **{\"captcha_id\" : \"e392e1d7fd421dc63325744d5a2b9c73\"}**",
    optional: true,
  },
};
