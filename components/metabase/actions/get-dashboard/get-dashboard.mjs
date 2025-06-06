import app from "../../metabase.app.mjs";

export default {
  key: "metabase-get-dashboard",
  name: "Get Dashboard",
  description: "Retrieve dashboard information and its cards. [See the documentation](https://www.metabase.com/docs/latest/api#tag/apidashboard/GET/api/dashboard/).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    dashboardId: {
      propDefinition: [
        app,
        "dashboardId",
      ],
    },
  },
  async run({ $ }) {
    const { dashboardId } = this;

    const response = await this.app.getDashboard({
      $,
      dashboardId,
    });

    $.export("$summary", `Successfully retrieved dashboard "${response.name}" with ${response.dashcards?.length || 0} cards`);

    return response;
  },
};
