import homerun from "../../homerun.app.mjs";

export default {
  key: "homerun-list-job-application-id-options",
  name: "List Job Application ID Options",
  description: "Retrieves available options for the Job Application ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    homerun,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await homerun.propDefinitions.jobApplicationId.options.call(this.homerun, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
