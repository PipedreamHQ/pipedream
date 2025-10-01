import app from "../../metabase.app.mjs";

export default {
  key: "metabase-get-dashboard",
  name: "Get Dashboard",
  description: "Retrieve dashboard information and its cards. [See the documentation](https://www.metabase.com/docs/latest/api#tag/apidashboard/get/api/dashboard/{id}).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const {
      app,
      dashboardId,
    } = this;

    const response = await app.getDashboard({
      $,
      dashboardId,
    });

    $.export("$summary", `Successfully retrieved dashboard with ID \`${response?.id}\``);

    return response;
  },
};
