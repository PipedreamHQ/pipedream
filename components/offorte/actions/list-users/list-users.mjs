import offorte from "../../offorte.app.mjs";

export default {
  key: "offorte-list-users",
  name: "List Users",
  description: "List all users in Offorte. [See the documentation](https://www.offorte.com/api-docs/api#tag/Account/operation/usersList)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    offorte,
  },
  async run({ $ }) {
    const response = await this.offorte.listUsers({
      $,
    });

    $.export("$summary", `Successfully fetched ${response.length} users`);
    return response;
  },
};
