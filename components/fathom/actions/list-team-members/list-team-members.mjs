// x-pd-ai: optimized
import fathom from "../../fathom.app.mjs";

export default {
  key: "fathom-list-team-members",
  name: "List Team Members",
  description: "List the members of a team, or all team members across the account. Use **List Teams** to find a valid team name to filter by. [See the documentation](https://developers.fathom.ai/api-reference/team-members/list-team-members)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fathom,
    teamName: {
      propDefinition: [
        fathom,
        "teamName",
      ],
    },
    cursor: {
      propDefinition: [
        fathom,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fathom.listTeamMembers({
      $,
      params: {
        team: this.teamName,
        cursor: this.cursor,
      },
    });
    $.export("$summary", `Found ${response?.items?.length} team members`);
    return response;
  },
};
