import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-job-change-reason-id-options",
  name: "List Job Change Reason ID Options",
  description: "Retrieves available options for the Job Change Reason ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    workday,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await workday.propDefinitions.jobChangeReasonId.options.call(this.workday, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
