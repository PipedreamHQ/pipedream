// x-pd-ai: optimized
import fathom from "../../fathom.app.mjs";

export default {
  key: "fathom-list-teams",
  name: "List Teams",
  description: "List the teams configured for the account. Use this to discover valid team names before filtering **List Team Members**, **List Users and Permissions**, or other team-scoped tools. [See the documentation](https://developers.fathom.ai/api-reference/teams/list-teams)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fathom,
    cursor: {
      type: "string",
      label: "Cursor",
      description: "If continuing a previous request, the cursor to start from",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.fathom.listTeams({
      $,
      params: {
        cursor: this.cursor,
      },
    });
    $.export("$summary", `Found ${response?.items?.length} teams`);
    return response;
  },
};
