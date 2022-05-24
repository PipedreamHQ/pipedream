import common from "../common/common.mjs";

export default {
  ...common,
  key: "clickup-get-team-views",
  name: "Get Team Views",
  description: "Get all views of a team. See the docs [here](https://clickup.com/api) in **Views  / Get Team Views** section.",
  version: "0.0.1",
  type: "action",
  async run({ $ }) {
    const { workspaceId } = this;

    const response = await this.clickup.getTeamViews({
      $,
      workspaceId,
    });

    $.export("$summary", "Successfully retrieved team views");

    return response;
  },
};
