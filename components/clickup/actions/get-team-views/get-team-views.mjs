import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-get-team-views",
  name: "Get Team Views",
  description: "Get all views of a team. See the docs [here](https://clickup.com/api) in **Views  / Get Team Views** section.",
  version: "0.0.1",
  type: "action",
  props: {
    clickup,
    workspaceId: {
      propDefinition: [
        clickup,
        "workspaces",
      ],
    },
  },
  async run({ $ }) {
    const { workspaceId } = this;

    const response = await this.clickup.getTeamViews({
      $,
      workspaceId,
    });

    $.export("$summary", "Successfully getted team views");

    return response;
  },
};
