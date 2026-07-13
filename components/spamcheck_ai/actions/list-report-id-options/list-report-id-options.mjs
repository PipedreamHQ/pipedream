import spamcheck_ai from "../../spamcheck_ai.app.mjs";

export default {
  key: "spamcheck_ai-list-report-id-options",
  name: "List Report ID Options",
  description: "Retrieves available options for the Report ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    spamcheck_ai,
  },
  async run({ $ }) {
    const options = await spamcheck_ai.propDefinitions.reportId.options.call(this.spamcheck_ai, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
