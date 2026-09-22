import newscatcher from "../../newscatcher.app.mjs";

export default {
  key: "newscatcher-list-job-id-options",
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
    newscatcher,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await newscatcher.propDefinitions.jobId.options.call(this.newscatcher, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
