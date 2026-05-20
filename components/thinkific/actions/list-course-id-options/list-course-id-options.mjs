import thinkific from "../../thinkific.app.mjs";

export default {
  key: "thinkific-list-course-id-options",
  name: "List Course ID Options",
  description: "Retrieves available options for the Course ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    thinkific,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await thinkific.propDefinitions.courseId.options.call(this.thinkific, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
