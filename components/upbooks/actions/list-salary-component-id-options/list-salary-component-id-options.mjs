import upbooks from "../../upbooks.app.mjs";

export default {
  key: "upbooks-list-salary-component-id-options",
  name: "List Salary Component Id Options",
  description: "Retrieves available options for the Salary Component Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    upbooks,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await upbooks.propDefinitions.salaryComponentId.options.call(this.upbooks, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
