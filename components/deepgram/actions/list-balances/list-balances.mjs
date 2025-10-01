import deepgram from "../../deepgram.app.mjs";

export default {
  key: "deepgram-list-balances",
  name: "List Balances",
  description: "Generates a list of outstanding balances for the specified project. [See the documentation](https://developers.deepgram.com/api-reference/billing/#get-all-balances)",
  version: "0.0.3",
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
  },
  async run({ $ }) {
    const { balances } = await this.deepgram.listBalances({
      projectId: this.projectId,
      $,
    });

    if (balances) {
      $.export("$summary", `Successfully retrieved ${balances.length} balance${balances.length === 1
        ? ""
        : "s"}`);
    }

    return balances;
  },
};
