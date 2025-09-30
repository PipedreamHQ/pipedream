import google_cloud_translate from "../../google_cloud_translate.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  name: "Translate",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "google_cloud_translate-translate",
  description: "Translate text using Google Cloud Translate",
  props: {
    google_cloud_translate,
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
      async options() {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2/languages?key=${this.google_cloud_translate.$auth.api_key}&target=en`, {
          method: "GET",
        });
        const data = await response.json();
        return data.data.languages.map((language) => ({
          label: language.name,
          value: language.language,
        }));
      },
    },
  },
  type: "action",
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
