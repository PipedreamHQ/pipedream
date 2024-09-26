export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the Cutcaptcha task.",
    options: [
      "CutCaptchaTaskProxyless",
      "CutCaptchaTask",
    ],
    default: "CutCaptchaTaskProxyless",
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
    description: "The value of **CUTCAPTCHA_MISERY_KEY** variable defined on page.",
  },
  apiKey: {
    type: "string",
    label: "Api Key",
    description: "The value of **data-apikey** attribute of iframe's body. Also the name of javascript file included on the page.",
    optional: true,
  },
};
