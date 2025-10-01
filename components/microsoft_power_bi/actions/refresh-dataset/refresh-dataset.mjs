import powerBi from "../../microsoft_power_bi.app.mjs";

export default {
  key: "microsoft_power_bi-refresh-dataset",
  name: "Refresh Dataset",
  description: "Triggers a refresh operation for a specified Power BI dataset. [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/refresh-dataset)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    powerBi,
    datasetId: {
      propDefinition: [
        powerBi,
        "datasetId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.powerBi.refreshDataset({
      $,
      datasetId: this.datasetId,
    });

    $.export("$summary", `Successfully triggered a refresh for dataset (ID ${this.datasetId})`);
    return response;
  },
};
