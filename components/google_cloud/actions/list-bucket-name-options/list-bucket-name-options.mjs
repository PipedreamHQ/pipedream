import google_cloud from "../../google_cloud.app.mjs";

export default {
  key: "google_cloud-list-bucket-name-options",
  name: "List Bucket Name Options",
  description: "Retrieves available options for the Bucket Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    google_cloud,
  },
  async run({ $ }) {
    const options = await google_cloud.propDefinitions.bucketName.options.call(this.google_cloud);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
