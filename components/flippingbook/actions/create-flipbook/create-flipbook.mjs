import flippingbook from "../../flippingbook.app.mjs";

export default {
  key: "flippingbook-create-flipbook",
  name: "Create Flipbook",
  description: "Generates a new flipbook from an input PDF file. [See the documentation](https://apidocs.flippingbook.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    flippingbook,
    pdfFile: {
      type: "string",
      label: "PDF File",
      description: "The input PDF file to generate a new flipbook. The maximum size is 100MB.",
      required: true,
    },
    flipbookTitle: {
      type: "string",
      label: "Flipbook Title",
      description: "The title of the new flipbook.",
      required: true,
    },
  },
  async run({ $ }) {
    const response = await this.flippingbook.createFlipbook({
      pdfFile: this.pdfFile,
      title: this.flipbookTitle,
    });
    $.export("$summary", `Successfully created flipbook ${this.flipbookTitle}`);
    return response;
  },
};
