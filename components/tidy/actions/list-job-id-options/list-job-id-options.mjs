import tidy from "../../tidy.app.mjs";

export default {
  key: "tidy-list-job-id-options",
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
    tidy,
  },
  async run({ $ }) {
    const options = await tidy.propDefinitions.jobId.options.call(this.tidy, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
