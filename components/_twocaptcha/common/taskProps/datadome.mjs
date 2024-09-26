export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the DataDome CAPTCHA task.",
    options: [
      "DataDomeSliderTask",
    ],
    default: "DataDomeSliderTask",
    reloadProps: true,
  },
  websiteURL: {
    type: "string",
    label: "Website URL",
    description: "The full URL of target web page where the captcha is loaded.",
  },
  captchaUrl: {
    type: "string",
    label: "Captcha Url",
    description: "The value of the **src** parameter for the **iframe** element containing the captcha on the page.",
  },
  userAgent: {
    type: "string",
    label: "User Agent",
    description: "User-Agent of your browser will be used to load the captcha. Use only modern browser's User-Agents.",
  },
};
