export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the reCAPTCHA V2 Enterprise task.",
    options: [
      "CapyTaskProxyless",
      "CapyTask",
    ],
    default: "CapyTaskProxyless",
    reloadProps: true,
  },
  websiteURL: {
    type: "string",
    label: "Website URL",
    description: "The full URL of target web page where the captcha is loaded. We do not open the page, not a problem if it is available only for authenticated users.",
  },
  websiteKey: {
    type: "string",
    label: "Website Key",
    description: "Capy Puzzle Captcha **captchakey**.",
  },
  userAgent: {
    type: "string",
    label: "User Agent",
    description: "User-Agent of your browser will be used to load the captcha. Use only modern browser's User-Agents.",
    optional: true,
  },
};
