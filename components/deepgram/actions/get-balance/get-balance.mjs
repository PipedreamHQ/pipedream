import deepgram from "../../deepgram.app.mjs";

export default {
  key: "deepgram-get-balance",
  name: "Get Balance",
  description: "Retrieves details about the specified balance. [See the documentation](https://developers.deepgram.com/api-reference/billing/#get-balance)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    deepgram,
    projectId: {
      propDefinition: [
        deepgram,
        "projectId",
      ],
    },
    balanceId: {
      propDefinition: [
        deepgram,
        "balanceId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const balance = await this.deepgram.getBalance({
      projectId: this.projectId,
      balanceId: this.balanceId,
      $,
    });

    if (balance) {
      $.export("$summary", `Successfully retrieved balance with ID ${this.balanceId}`);
    }

    return balance;
  },
};
