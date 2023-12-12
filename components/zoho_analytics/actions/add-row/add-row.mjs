import zohoAnalytics from "../../zoho_analytics.app.mjs";

export default {
  key: "zoho_analytics-add-row",
  name: "Add Row",
  version: "0.0.1",
  description: "Add a single row in the specified table. [See the documentation](https://www.zoho.com/analytics/api/v2/#add-row)",
  type: "action",
  props: {
    zohoAnalytics,
    workspaceId: {
      propDefinition: [
        zohoAnalytics,
        "workspaceId",
      ],
    },
    viewId: {
      propDefinition: [
        zohoAnalytics,
        "viewId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
    columns: {
      propDefinition: [
        zohoAnalytics,
        "columns",
      ],
    },
    dateFormat: {
      propDefinition: [
        zohoAnalytics,
        "dateFormat",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      zohoAnalytics,
      workspaceId,
      viewId,
      ...data
    } = this;

    const response = await zohoAnalytics.addRow({
      $,
      workspaceId,
      viewId,
      params: {
        CONFIG: JSON.stringify(data),
      },
    });

    $.export("$summary", "The new row was successfully added!");
    return response;
  },
};
