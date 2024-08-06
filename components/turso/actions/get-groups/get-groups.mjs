import app from "../../turso.app.mjs";

export default {
  key: "turso-get-groups",
  name: "Get Groups",
  description: "Returns a list of groups belonging to the organization or user. [See the documentation](https://docs.turso.tech/api-reference/groups/list)",
  version: "0.0.3",
  type: "action",
  props: {
    app,
    organizationName: {
      propDefinition: [
        app,
        "organizationName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getGroups({
      $,
      organizationName: this.organizationName,
    });

    $.export("$summary", `Successfully retrieved '${response.groups.length}' group(s)`);

    return response;
  },
};
