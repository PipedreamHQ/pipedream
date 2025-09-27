import app from "../../pdf_munk.app.mjs";

export default {
  key: "pdf_munk-capture-website-screenshot-into-image",
  name: "Capture Website Screenshot into Image",
  description: "Capture Screenshot of a Website URL into an image. [See documentation](https://pdfmunk.com/api-docs#:~:text=Image%20Generation)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "Website URL",
      description: "The URL of the website to capture as a screenshot",
    },
  },
  async run({ $ }) {
    const { url } = this;

    const response = await this.app.captureWebsiteScreenshot({
      $,
      url,
    });

    $.export("$summary", `Successfully captured screenshot of ${url}`);
    return response;
  },
};
