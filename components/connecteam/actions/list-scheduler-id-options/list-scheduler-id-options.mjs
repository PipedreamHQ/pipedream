import connecteam from "../../connecteam.app.mjs";

export default {
  key: "connecteam-list-scheduler-id-options",
  name: "List Scheduler ID Options",
  description: "Retrieves available options for the Scheduler ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    connecteam,
  },
  async run({ $ }) {
    const options = await connecteam.propDefinitions.schedulerId.options.call(this.connecteam);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
