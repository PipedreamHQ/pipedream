import edusign from "../../edusign.app.mjs";

export default {
  key: "edusign-list-professor-id-options",
  name: "List Professor ID Options",
  description: "Retrieves available options for the Professor ID field.",
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
    const options = await edusign.propDefinitions.professorId.options.call(this.edusign, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
