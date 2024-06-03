import flippingbook from "../../flippingbook.app.mjs";

export default {
  key: "flippingbook-update-flipbook",
  name: "Update Flipbook",
  description: "Edits an existing flipbook by replacing it with a new input PDF file. [See the documentation](https://apidocs.flippingbook.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    flippingbook,
    flipbookId: {
      propDefinition: [
        flippingbook,
        "flipbookId",
      ],
    },
    pdfFile: {
      propDefinition: [
        flippingbook,
        "pdfFile",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.flippingbook.updateFlipbook({
      flipbookId: this.flipbookId,
      pdfFile: this.pdfFile,
    });
    $.export("$summary", `Successfully updated flipbook with ID: ${this.flipbookId}`);
    return response;
  },
};
