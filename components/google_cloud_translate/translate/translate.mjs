import { axios } from "@pipedream/platform";

export default {
  name: "Translate",
  version: "0.0.1",
  key: "google-cloud-translate-text",
  description: "Translate text using Google Cloud Translate",
  props: {
    google_cloud_translate: {
      type: "app",
      app: "google_cloud_translate",
    },
    text: {
      type: "string",
      description: "Text to translate",
      label: "Text",
    },
    target: {
      type: "string",
      label: "Target Language",
      description: "The two letter ISO code for the language to translate the text into",
      default: "en",
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    return await axios($, {
      method: "post",
      url: `https://translation.googleapis.com/language/translate/v2?key=${this.google_cloud_translate.$auth.api_key}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      data: {
        q: this.text,
        target: this.target,
      },
    });
  },
};
