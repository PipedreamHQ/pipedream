import cloudtables from "../../cloudtables.app.mjs";

export default {
  key: "cloudtables-delete-row",
  name: "Delete Row",
  description: "Delete a row in a CloudTable data set",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cloudtables,
    datasetID: {
      propDefinition: [
        cloudtables,
        "datasetID",
      ],
      withLabel: true,
    },
    rowID: {
      propDefinition: [
        cloudtables,
        "rowID",
      ],
    },
  },
  async run({ $ }) {
    const datasetID = this.datasetID?.value ?? this.datasetID;
    const rowID = this.rowID?.value || this.rowID;

    const deleteRowResponse = await this.cloudtables.deleteRowFromDataSet(datasetID, rowID);

    $.export("$summary", `Deleted row [${rowID}] from [${datasetID}].`);

    return deleteRowResponse;
  },
};
