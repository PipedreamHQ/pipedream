import sign_plus from "../../sign_plus.app.mjs";

export default {
  key: "sign_plus-send-envelope",
  name: "Send Envelope",
  description: "Sends an envelope. [See the documentation](https://apidoc.sign.plus/api-reference/endpoints/signplus/send-envelope-for-signature)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    sign_plus,
    envelopeId: {
      propDefinition: [
        sign_plus,
        "envelopeId",
      ],
    },
    sandbox: {
      type: "boolean",
      label: "Sandbox",
      description: "Whether to use sandbox mode",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sign_plus.sendEnvelope({
      $,
      envelopeId: this.envelopeId,
      data: {
        sandbox: this.sandbox,
      },
    });
    $.export("$summary", `Successfully sent envelope with ID: ${this.envelopeId}`);
    return response;
  },
};
