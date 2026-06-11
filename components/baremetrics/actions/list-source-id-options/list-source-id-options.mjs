import baremetrics from "../../baremetrics.app.mjs";

export default {
  key: "baremetrics-list-source-id-options",
  name: "List Source ID Options",
  description: "Retrieves available options for the Source ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    baremetrics,
  },
  async run({ $ }) {
    const options = await baremetrics.propDefinitions.sourceId.options.call(this.baremetrics);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
