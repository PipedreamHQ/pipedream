import app from "../../deel.app.mjs";

export default {
  key: "deel-get-contract",
  name: "Get Contract",
  description:
    "Retrieve full details for a specific Deel contract by ID, including worker info, compensation,"
    + " status, and timeline. Works for IC, EOR, and GP contract types."
    + " Use **List Contracts** to find contract IDs."
    + " [See the documentation](https://developer.deel.com/docs/get-a-single-contract)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    contractId: {
      propDefinition: [
        app,
        "contractId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      path: `/contracts/${this.contractId}`,
    });

    const contract = response?.data ?? response;
    const title = contract?.title ?? contract?.name ?? this.contractId;
    $.export("$summary", `Retrieved contract: ${title}`);
    return response;
  },
};
