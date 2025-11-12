import browserless from "../../browserless.app.mjs";
import fs from "fs";

export default {
  key: "browserless-convert-html-to-pdf",
  name: "Generate PDF from HTML String",
  description: "See https://docs.browserless.io/docs/pdf.html",
  version: "0.4.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    browserless,
    html: {
      type: "string",
      label: "HTML String",
      description: "HTML to render as a PDF",
    },
    downloadPath: {
      type: "string",
      label: "Download Path",
      description: "Download the screenshot to the `/tmp` directory with the specified filename",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    async downloadToTMP(screenshot) {
      const path = this.downloadPath.includes("/tmp")
        ? this.downloadPath
        : `/tmp/${this.downloadPath}`;
      fs.writeFileSync(path, screenshot);
      return path;
    },
  },
  async run({ $ }) {
    const { html } = this;

    const data = await this.browserless.convertHtmlToPdf({
      $,
      data: {
        html,
      },
    });

    const result = {
      pdf: Buffer.from(data, "binary").toString("base64"),
    };

    if (data && this.downloadPath) {
      const filePath = await this.downloadToTMP(data);
      result.filePath = filePath;
    }

    if (data) {
      $.export("$summary", "Successfully generated PDF from HTML string.");
    }

    return result;
  },
};
