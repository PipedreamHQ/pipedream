export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the Audio CAPTCHA task.",
    options: [
      "AudioTask",
    ],
    default: "AudioTask",
    reloadProps: true,
  },
  body: {
    type: "string",
    label: "Body",
    description: "Base64 encoded audio file in mp3 format.",
  },
  lang: {
    type: "string",
    label: "Lang",
    description: "The language of audio record.",
    options: [
      "en",
      "fr",
      "de",
      "el",
      "pt",
      "ru",
    ],
    default: "en",
  },
};
