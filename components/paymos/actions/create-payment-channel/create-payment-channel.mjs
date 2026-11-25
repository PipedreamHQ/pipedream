import paymos from "../../paymos.app.mjs";

export default {
  key: "paymos-create-payment-channel",
  name: "Create Payment Channel",
  description: "Idempotently create or retrieve a permanent multi-network deposit channel for a customer. [See the documentation](https://paymos.io/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    paymos,
    projectId: {
      propDefinition: [
        paymos,
        "projectId",
      ],
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "Your stable customer identifier (max 128 characters). Repeating the same `project_id` and `external_id` returns the existing channel.",
    },
  },
  async run({ $ }) {
    const response = await this.paymos.createPaymentChannel({
      projectId: this.projectId,
      externalId: this.externalId,
    });
    $.export("$summary", `Successfully created or retrieved payment channel ${response?.channel_id ?? response?.id ?? this.externalId}`);
    return response;
  },
};
