import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-delete-signature",
  name: "Delete Sender Signature",
  description: "Delete a specific sender signature. [See the documentation](https://postmarkapp.com/developer/api/signatures-api#delete-signature)",
  version: "0.0.2",
  type: "action",
  props: {
    postmark,
    signatureId: {
      propDefinition: [
        postmark,
        "signatureId",
      ],
      withLabel: true,
    },
  },
  async run({ $ }) {
    const response = await this.postmark.deleteSignature({
      $,
      signatureId: this.signatureId.value,
    });

    $.export("$summary", `Sender Signature ${this.signatureId.label} was successfully deleted!`);
    return response;
  },
};
