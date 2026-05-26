import edusign from "../../edusign.app.mjs";

export default {
  key: "edusign-list-student-id-options",
  name: "List Student ID Options",
  description: "Retrieves available options for the Student ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    edusign,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await edusign.propDefinitions.studentId.options.call(this.edusign, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
