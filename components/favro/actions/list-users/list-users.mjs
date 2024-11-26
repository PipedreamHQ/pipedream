import app from "../../favro.app.mjs";

export default {
  key: "favro-list-users",
  name: "List Users",
  description: "List all users in the organization. [See the documentation](https://docs.x.ai/api/endpoints#get-model)",
  version: "0.0.1",
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
