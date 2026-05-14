import smstools from "../../smstools.app.mjs";

export default {
  key: "smstools-list-sub-id-options",
  name: "List Sub ID Options",
  description: "Retrieves available options for the Sub ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smstools,
  },
  async run({ $ }) {
    const options = await smstools.propDefinitions.subId.options.call(this.smstools);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
