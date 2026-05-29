import apollo_io from "../../apollo_io.app.mjs";

export default {
  key: "apollo_io-list-label-names-options",
  name: "List Label Names Options",
  description: "Retrieves available options for the Label Names field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    apollo_io,
  },
  async run({ $ }) {
    const options = await apollo_io.propDefinitions.labelNames.options.call(this.apollo_io);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
