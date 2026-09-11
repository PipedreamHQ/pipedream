import grain from "../../grain.app.mjs";

export default {
  key: "grain-list-teams",
  name: "List Teams",
  description: "Lists the teams in your Grain workspace (id, name)."
    + " Use this to resolve a team's ID before sharing a recording with it via **Manage Recording Sharing**."
    + " Example: returns `[{\"id\": \"a414c333-c9fe-4fdc-9131-fb31796699b2\", \"name\": \"Pipedream\"}]`."
    + " [See the documentation](https://developers.grain.com/#list-teams)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    grain,
  },
  async run({ $ }) {
    const { teams } = await this.grain.listTeams({
      $,
    });

    $.export("$summary", `Found ${teams.length} team${teams.length === 1
      ? ""
      : "s"}`);
    return teams;
  },
};
