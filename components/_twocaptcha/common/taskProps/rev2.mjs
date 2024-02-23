export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the reCAPTCHA V2 task.",
    options: [
      "RecaptchaV2TaskProxyless",
      "RecaptchaV2Task",
    ],
    default: "RecaptchaV2TaskProxyless",
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
    description: "reCAPTCHA sitekey. Can be found inside data-sitekey property of the reCAPTCHA div element or inside k parameter of the requests to reCAPTHCHA API. You can also use the [script](https://gist.github.com/2captcha/2ee70fa1130e756e1693a5d4be4d8c70) to find the value.",
  },
  recaptchaDataSValue: {
    type: "string",
    label: "reCaptcha Data S Value",
    description: "The value of data-s parameter. Can be required to bypass the captcha on Google services.",
    optional: true,
  },
  isInvisible: {
    type: "boolean",
    label: "Is Invisible",
    description: "Pass true for Invisible version of reCAPTCHA - a case when you don't see the checkbox, but the challenge appears. Mostly used with a callback function.",
    optional: true,
  },
};
