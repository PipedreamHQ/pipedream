import google_cloud from "../../google_cloud.app.mjs";

export default {
  key: "google_cloud-list-dataset-id-options",
  name: "List Dataset ID Options",
  description: "Retrieves available options for the Dataset ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    google_cloud,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await google_cloud.propDefinitions.datasetId.options.call(this.google_cloud, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
