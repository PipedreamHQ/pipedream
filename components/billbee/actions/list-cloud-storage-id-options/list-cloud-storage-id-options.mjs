import billbee from "../../billbee.app.mjs";

export default {
  key: "billbee-list-cloud-storage-id-options",
  name: "List Cloud Storage ID Options",
  description: "Retrieves available options for the Cloud Storage ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    billbee,
  },
  async run({ $ }) {
    const options = await billbee.propDefinitions.cloudStorageId.options.call(this.billbee);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
