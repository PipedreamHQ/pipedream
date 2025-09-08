// legacy_hash_id: a_B0ip1E
import { axios } from "@pipedream/platform";

export default {
  key: "browserless-convert-html-to-pdf",
  name: "Generate PDF from HTML String",
  description: "See https://docs.browserless.io/docs/pdf.html",
  version: "0.4.1",
  type: "action",
  props: {
    browserless: {
      type: "app",
      app: "browserless",
    },
    html: {
      type: "string",
      label: "HTML String",
      description: "HTML to render as a PDF",
    },
  },
  async run({ $ }) {
    const { html } = this;

    const data = await axios($, {
      method: "POST",
      url: `https://chrome.browserless.io/pdf?token=${this.browserless.$auth.api_key}`,
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
      data: {
        html,
        options: {
          displayHeaderFooter: true,
          printBackground: false,
          format: "Letter",
        },
      },
    });

    $.export("pdf", Buffer.from(data, "binary").toString("base64"));
  },
};
