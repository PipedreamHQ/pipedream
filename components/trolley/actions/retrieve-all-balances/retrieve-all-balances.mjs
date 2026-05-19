import trolley from "../../trolley.app.mjs";

export default {
  key: "trolley-retrieve-all-balances",
  name: "Retrieve All Balances",
  description: "Retrieve all account balances. [See the documentation](https://developers.trolley.com/api/#retrieve-all-balances)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trolley,
  },
  async run({ $ }) {
    const response = await this.trolley.listBalances({
      $,
    });
    $.export("$summary", "Successfully retrieved account balances");
    return response;
  },
};
