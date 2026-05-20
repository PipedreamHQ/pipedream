import proworkflow from "../../proworkflow.app.mjs";

export default {
  key: "proworkflow-list-company-id-options",
  name: "List Company ID Options",
  description: "Retrieves available options for the Company ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    proworkflow,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await proworkflow.propDefinitions.companyId.options.call(this.proworkflow, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
