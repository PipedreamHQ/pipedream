import donately from "../../donately.app.mjs";

export default {
  key: "donately-list-accounts",
  name: "List Accounts",
  description: "List all accounts. [See the documentation](https://developer.donate.ly/api/#accounts)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: true,
  },
  props: {
    donately,
    maxResults: {
      propDefinition: [
        donately,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.donately.getPaginatedResources(this.donately.listAccounts, {
      $,
    }, this.maxResults);
    const count = response?.length ?? 0;
    $.export("$summary", `Found ${count} account${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
