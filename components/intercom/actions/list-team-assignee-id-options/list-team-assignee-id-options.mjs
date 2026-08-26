// x-pd-ai: optimized
import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-list-team-assignee-id-options",
  name: "List Assignee ID Options",
  description: "Retrieves all teams in your Intercom workspace and returns their IDs and names. Call this action before **Manage A Conversation** to discover valid team IDs for conversation assignment. Example: returns `[{ label: \"Support\", value: \"334\" }, ...]`. Use `0` to represent Unassigned. [See the documentation](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/teams/listteams).",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    intercom,
  },
  async run({ $ }) {
    const { teams } = await this.intercom.getTeams();
    const options = teams.map(({
      id: value, name: label,
    }) => ({
      label,
      value,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
