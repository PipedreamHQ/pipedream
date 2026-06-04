import app from "../../deel.app.mjs";

export default {
  key: "deel-sign-contract",
  name: "Sign Contract",
  description:
    "Sign a Deel contract as the client/employer. Use this to countersign a contract that has been"
    + " sent to and signed by the contractor."
    + " `client_signature` is typically the full legal name of the signing party."
    + " Use **List Contracts** to find the contract ID."
    + " [See the documentation](https://developer.deel.com/docs/sign-a-contract)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contractId: {
      propDefinition: [
        app,
        "contractId",
      ],
    },
    clientSignature: {
      type: "string",
      label: "Client Signature",
      description: "The signature of the client/employer (typically a full legal name, e.g., `Dr. John Hammond`).",
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      path: `/contracts/${this.contractId}/signatures`,
      method: "POST",
      data: {
        data: {
          client_signature: this.clientSignature,
        },
      },
    });

    $.export("$summary", `Signed contract ${this.contractId}`);
    return response;
  },
};
