export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the MTCaptcha task.",
    options: [
      "MtCaptchaTaskProxyless",
      "MtCaptchaTask",
    ],
    default: "MtCaptchaTaskProxyless",
    reloadProps: true,
  },
  websiteURL: {
    type: "string",
    label: "Website URL",
    description: "The full URL of target web page where the captcha is loaded.",
  },
  websiteKey: {
    type: "string",
    label: "Website Key",
    description: "The MTCaptcha **sitekey** value found in the page code.",
  },
};
