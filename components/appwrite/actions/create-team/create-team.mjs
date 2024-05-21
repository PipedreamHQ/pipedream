import app from "../../appwrite.app.mjs";

export default {
  key: "appwrite-create-team",
  name: "Create Team",
  description: "Create a new team. [See the documentation](https://appwrite.io/docs/references/cloud/client-rest/teams#create)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    teamId: {
      propDefinition: [
        app,
        "teamId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createTeam({
      $,
      data: {
        teamId: this.teamId,
        name: this.name,
        roles: this.roles,
      },
    });

    $.export("$summary", `Successfully created team '${response.name}'`);

    return response;
  },
};
