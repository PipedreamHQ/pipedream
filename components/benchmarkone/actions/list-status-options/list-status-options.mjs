import benchmarkone from "../../benchmarkone.app.mjs";

export default {
  key: "benchmarkone-list-status-options",
  name: "List Status Options",
  description: "Retrieves available options for the Status field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    benchmarkone,
  },
  async run({ $ }) {
    const options = await benchmarkone.propDefinitions.status.options.call(this.benchmarkone);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
