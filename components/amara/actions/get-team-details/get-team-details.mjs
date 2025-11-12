import amara from "../../amara.app.mjs";

export default {
  key: "amara-get-team-details",
  name: "Get Team Details",
  description: "Get details on a team. [See the docs here](https://apidocs.amara.org/#get-details-on-a-team)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    amara,
    teamId: {
      description: "Name for the team slug (used in URLs) (e.g. `amplify` in `https://amara.org/en/teams/amplify/`)",
      propDefinition: [
        amara,
        "team",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.amara.getTeam({
      $,
      teamId: this.teamId,
    });

    $.export("$summary", `Successfully fetched team details for "${response.name}"`);

    return response;
  },
};
