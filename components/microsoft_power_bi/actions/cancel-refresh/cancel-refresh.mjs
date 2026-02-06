import powerBi from "../../microsoft_power_bi.app.mjs";

export default {
  key: "microsoft_power_bi-cancel-refresh",
  name: "Cancel Dataset Refresh",
  description: "Cancels a refresh operation for a specified dataset in Power BI. [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/cancel-refresh)",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
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
    refreshId: {
      propDefinition: [
        powerBi,
        "refreshId",
        ({ datasetId }) => ({
          datasetId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.powerBi.cancelRefresh({
      $,
      datasetId: this.datasetId,
      refreshId: this.refreshId,
    });

    $.export("$summary", `Successfully cancelled refresh operation for dataset ID ${this.datasetId}`);
    return response;
  },
};
