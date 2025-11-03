import { parseOne } from "../../common/utils.mjs";
import zohoAnalytics from "../../zoho_analytics.app.mjs";

export default {
  key: "zoho_analytics-update-row",
  name: "Update Row",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update rows in the specified table. [See the documentation](https://www.zoho.com/analytics/api/v2/#update-row)",
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
      withLabel: true,
    },
    columns: {
      propDefinition: [
        zohoAnalytics,
        "columns",
      ],
    },
    updateAllRows: {
      type: "boolean",
      label: "Update All Rows",
      description: "To update all the rows in the table.",
      optional: true,
      reloadProps: true,
    },
    dateFormat: {
      propDefinition: [
        zohoAnalytics,
        "dateFormat",
      ],
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.updateAllRows) {
      props.criteria = {
        type: "object",
        label: "Criteria",
        description: "If criteria is sent, then the rows matching the criteria alone are updated. Refer this [link](https://www.zoho.com/analytics/api/v2/index.html#applying-filter-criteria) for more details about how to construct a criteria.",
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      zohoAnalytics,
      workspaceId,
      viewId,
      criteria,
      ...data
    } = this;

    if (criteria) {
      let query = "1=1";

      Object.entries(parseOne(criteria)).map(([
        key,
        value,
      ]) => (
        query += `and "${viewId.label}"."${key}"='${value}'`
      ));

      data.criteria = query;
    }

    const response = await zohoAnalytics.updateRow({
      $,
      workspaceId,
      viewId: viewId.value,
      params: {
        CONFIG: JSON.stringify(data),
      },
    });

    const length = response.data.updatedRows;

    $.export("$summary", `${length} row${length > 1
      ? "s where"
      : " was"} successfully updated!`);

    return response;
  },
};
