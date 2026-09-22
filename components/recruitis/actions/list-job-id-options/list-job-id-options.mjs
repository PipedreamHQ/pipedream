import recruitis from "../../recruitis.app.mjs";

export default {
  key: "recruitis-list-job-id-options",
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
    recruitis,
  },
  async run({ $ }) {
    const options = await recruitis.propDefinitions.jobID.options.call(this.recruitis);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
