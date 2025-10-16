import cloudtables from "../../cloudtables.app.mjs";

export default {
  key: "cloudtables-add-single-row",
  name: "Add Single Row",
  description: "Add a single row of data into CloudTable data set",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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

    const postRowResponse = await this.cloudtables.postRowIntoDataSet(datasetID, rowData);

    $.export("$summary", `Added 1 row to [${datasetID}].`);

    return postRowResponse;
  },
};
