import domo from "../../domo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "domo-add-data-to-dataset",
  name: "Add Data to Dataset",
  description: "Adds new rows of data to an existing Domo dataset. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    domo,
    datasetId: {
      propDefinition: [
        domo,
        "datasetId",
      ],
    },
    data: {
      propDefinition: [
        domo,
        "data",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.domo.addDatasetRows({
      datasetId: this.datasetId,
      data: this.data,
    });
    $.export("$summary", `Added ${this.data.length} rows to dataset ${this.datasetId}`);
    return response;
  },
};
