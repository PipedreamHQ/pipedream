import influxdb_cloud from "../../influxdb_cloud.app.mjs";

export default {
  key: "influxdb_cloud-list-bucket-id-options",
  name: "List Bucket ID Options",
  description: "Retrieves available options for the Bucket ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    influxdb_cloud,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await influxdb_cloud.propDefinitions.bucketId.options
      .call(this.influxdb_cloud, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
