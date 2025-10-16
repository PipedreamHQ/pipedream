import app from "../../taggun.app.mjs";

export default {
  key: "taggun-submit-feedback",
  name: "Submit Feedback",
  description: "Add manually verified receipt data to a given receipt for feedback and training purposes. [See the documentation](https://developers.taggun.io/reference/improve-your-restuls)",
  version: "0.0.1",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    referenceId: {
      propDefinition: [
        app,
        "referenceId",
      ],
    },
    totalAmount: {
      propDefinition: [
        app,
        "totalAmount",
      ],
    },
    taxAmount: {
      propDefinition: [
        app,
        "taxAmount",
      ],
    },
    merchantName: {
      propDefinition: [
        app,
        "merchantName",
      ],
    },
    currencyCode: {
      propDefinition: [
        app,
        "currencyCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.submitFeedback({
      $,
      data: {
        referenceId: this.referenceId,
        totalAmount: this.totalAmount,
        taxAmount: this.taxAmount,
        merchantName: this.merchantName,
        currencyCode: this.currencyCode,
      },
    });
    $.export("$summary", "Successfully submitted feedback");
    return response;
  },
};
