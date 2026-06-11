import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-job-id-options",
  name: "List Job ID Options",
  description: "Retrieves available options for the Job ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
  },
  async run({ $ }) {
    const options = await bamboohr.propDefinitions.jobId.options.call(this.bamboohr);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
