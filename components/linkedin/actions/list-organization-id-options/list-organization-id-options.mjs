import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-list-organization-id-options",
  name: "List Organization Id Options",
  description: "Retrieves available options for the Organization Id field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linkedin,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await linkedin.propDefinitions.organizationId.options.call(this.linkedin, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
