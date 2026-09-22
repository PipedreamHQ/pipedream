import databox from "../../databox.app.mjs";

export default {
  key: "databox-list-metric-key-options",
  name: "List Metric Key Options",
  description: "Retrieves available options for the Metric Key field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    databox,
  },
  async run({ $ }) {
    const options = await databox.propDefinitions.metricKey.options.call(this.databox);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
