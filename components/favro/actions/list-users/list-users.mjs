import app from "../../favro.app.mjs";

export default {
  key: "favro-list-users",
  name: "List Users",
  description: "List all users in the organization. [See the documentation](https://favro.com/developer/#get-all-users)",

  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.listUsers({
      $,
      organizationId: this.organizationId,
    });

    $.export("$summary", `Successfully retrieved ${response.entities.length} user(s)`);

    return response;
  },
};
