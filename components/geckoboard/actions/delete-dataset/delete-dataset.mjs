import app from "../../geckoboard.app.mjs";

export default {
  key: "geckoboard-delete-dataset",
  name: "Delete Dataset",
  description: "Delete the specified dataset. [See the documentation](https://developer.geckoboard.com/?#delete-a-dataset)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteDataset({
      $,
      datasetId: this.datasetId,
    });
    $.export("$summary", "Successfully deleted dataset");
    return response;
  },
};
