import app from "../../appwrite.app.mjs";

export default {
  key: "appwrite-get-members",
  name: "Get Members",
  description: "Get accounts setup information. [See the documentation](https://appwrite.io/docs/references/cloud/client-rest/teams#listMemberships)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    teamId: {
      propDefinition: [
        app,
        "teamId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getMembers({
      $,
      teamId: this.teamId,
    });

    $.export("$summary", `Successfully retrieved ${response.total} members`);

    return response;
  },
};
