import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-list-account-id-options",
  name: "List Account ID Options",
  description: "List the Harvest accounts (companies) the authenticated user has access to, each with its Account ID. Use this first to find the Account ID required by every other Harvest tool. Example: call with no parameters, then pass the returned id as Account ID on any other Harvest tool call. [See the documentation](https://help.getharvest.com/api-v2/accounts-api/accounts/accounts/#list-all-accounts-for-a-user).",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    harvest,
  },
  async run({ $ }) {
    const { accounts } = await this.harvest.listAccounts({
      $,
    });
    const options = accounts.map(({
      id, name, product,
    }) => ({
      label: `${name} (${product})`,
      value: id,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
