import { ConfigurationError } from "@pipedream/platform";
import app from "../../microsoft_power_bi.app.mjs";

export default {
  key: "microsoft_power_bi-get-dataset-refresh",
  name: "Get Dataset Refresh",
  description: "Triggers a refresh operation for a specified Power BI dataset. [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/get-refresh-history)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    datasetId: {
      propDefinition: [
        app,
        "datasetId",
      ],
      optional: true,
    },
    customDatasetId: {
      propDefinition: [
        app,
        "customDatasetId",
      ],
    },
    top: {
      type: "integer",
      label: "Top",
      description: "The number of refresh history items to retrieve.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      datasetId,
      customDatasetId,
      top,
    } = this;

    if (!datasetId && !customDatasetId) {
      throw new ConfigurationError("Must enter one of Dataset ID or custom Dataset ID");
    }

    const response = await this.app.getRefreshHistory({
      $,
      datasetId: datasetId || customDatasetId,
      params: {
        ["$top"]: top,
      },
    });

    $.export("$summary", `Successfully retrieved refresh history for dataset (ID \`${datasetId || customDatasetId}\`)`);
    return response;
  },
};
