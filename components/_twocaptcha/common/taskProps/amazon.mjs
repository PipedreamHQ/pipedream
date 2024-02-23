export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the Amazon AWS CAPTCHA task.",
    options: [
      "AmazonTaskProxyless",
      "AmazonTask",
    ],
    default: "AmazonTaskProxyless",
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
    description: "Value of **key** parameter you found on the page.",
  },
  iv: {
    type: "string",
    label: "IV",
    description: "Value of **iv** parameter you found on the.",
  },
  context: {
    type: "string",
    label: "Context",
    description: "Value of **context** parameter you found on the page.",
  },
  challengeScript: {
    type: "string",
    label: "Challenge Script",
    description: "The source URL of **challenge.js** script on the page.",
    optional: true,
  },
  captchaScript: {
    type: "string",
    label: "Captcha Script",
    description: "The source URL of **captcha.js** script on the page.",
    optional: true,
  },
};
