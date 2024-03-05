export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the Friendly task.",
    options: [
      "FriendlyCaptchaTaskProxyless",
      "FriendlyCaptchaTask",
    ],
    default: "FriendlyCaptchaTaskProxyless",
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
    description: "The value of **data-sitekey** attribute of captcha's **div** element on page.",
  },
};
