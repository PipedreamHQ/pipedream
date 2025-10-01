import cloudtables from "../../cloudtables.app.mjs";

export default {
  key: "cloudtables-update-row",
  name: "Update Row",
  description: "Update a row in a CloudTable data set",
  version: "0.0.2",
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
      reloadProps: true,
    },
    rowID: {
      propDefinition: [
        cloudtables,
        "rowID",
      ],
    },
  },
  async additionalProps() {
    const datasetID = this.datasetID?.value ?? this.datasetID;
    const dataSetSchema = await this.cloudtables.getDataSetSchema(datasetID);
    const { datapoints } = dataSetSchema;

    const props = {};
    for (const datapoint of datapoints) {
      // the column type is not available in cloudtables API
      props[`col_${datapoint.id}`] = {
        type: "string",
        label: datapoint.name,
        optional: true,
      };
    }

    return props;
  },
  async run({ $ }) {
    const datasetID = this.datasetID?.value ?? this.datasetID;
    const rowID = this.rowID?.value || this.rowID;

    const dataSetSchema = await this.cloudtables.getDataSetSchema(datasetID);
    const { datapoints } = dataSetSchema;

    if (datapoints.length === 0) {
      throw new Error(`No data points available at [${datasetID}].`);
    }

    const rowData = datapoints
      .reduce((prevValue, currValue) => {
        return {
          ...prevValue,
          [currValue.id]: this[`col_${currValue.id}`],
        };
      }, {});

    const putRowResponse = await this.cloudtables.putRowInDataSet(datasetID, rowID, rowData);

    $.export("$summary", `Updated row [${rowID}] from [${datasetID}].`);

    return putRowResponse;
  },
};
