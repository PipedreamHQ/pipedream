import powerBi from "../../microsoft_power_bi.app.mjs";

export default {
  key: "microsoft_power_bi-add-rows-dataset-table",
  name: "Add Rows to Power BI Dataset Table",
  description: "Adds new data rows to the specified table within the specified dataset from My workspace. [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/push-datasets/datasets-post-rows)",
  version: "0.0.1",
  type: "action",
  props: {
    powerBi,
    datasetId: {
      propDefinition: [
        powerBi,
        "datasetId",
      ],
    },
    tableName: {
      propDefinition: [
        powerBi,
        "tableName",
      ],
    },
    rows: {
      propDefinition: [
        powerBi,
        "rows",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.powerBi.addRowsToTable({
      datasetId: this.datasetId,
      tableName: this.tableName,
      rows: this.rows.map(JSON.parse),
    });

    $.export("$summary", `Successfully added rows to the table ${this.tableName} in the dataset ${this.datasetId}`);
    return response;
  },
};
