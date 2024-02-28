export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the Amazon AWS CAPTCHA task.",
    options: [
      "TextCaptchaTask",
    ],
    default: "TextCaptchaTask",
    reloadProps: true,
  },
  comment: {
    type: "string",
    label: "Comment",
    description: "Text with a question you need to answer.",
  },
};
