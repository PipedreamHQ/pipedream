import app from "../../appwrite.app.mjs";

export default {
  key: "appwrite-create-team",
  name: "Create Team",
  description: "Create a new team. [See the documentation](https://appwrite.io/docs/references/cloud/client-rest/teams#create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    teamId: {
      type: "string",
      label: "Team ID",
      description: "Choose a custom ID or generate a random ID with ID.unique(). Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore.",
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      description: "Name of the team",
    },
    roles: {
      propDefinition: [
        app,
        "roles",
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
