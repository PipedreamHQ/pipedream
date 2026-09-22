import app from "../../geckoboard.app.mjs";

export default {
  key: "geckoboard-append-to-dataset",
  name: "Append to Dataset",
  description: "Append data to the specified dataset. [See the documentation](https://developer.geckoboard.com/?#append-data-to-a-dataset)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    datasetId: {
      propDefinition: [
        app,
        "datasetId",
      ],
      reloadProps: true,
    },
  },

  async additionalProps(existingProps) {
    const datasetId = this.datasetId?.value || this.datasetId;
    const datasets = await this.app.getDatasets();

    const dataset = datasets.data.find((d) => d.id === datasetId);
    if (!dataset) return existingProps;

    const props = {};
    for (const [
      key,
      field,
    ] of Object.entries(dataset.fields)) {
      props[key] = {
        type: "string",
        label: field.name,
        optional: field.optional,
      };
    }

    return props;
  },

  async run({ $ }) {
    const data = {};

    for (const key of Object.keys(this)) {
      if (![
        "app",
        "datasetId",
      ].includes(key)) {
        let value = this[key];

        if (!isNaN(value)) {
          value = parseFloat(value);
        }

        data[key] = value;
      }
    }

    const response = await this.app.appendToDataset({
      $,
      datasetId: this.datasetId,
      data: {
        data: [
          data,
        ],
      },
    });

    $.export("$summary", "Successfully appended data to dataset");
    return response;
  },

};
