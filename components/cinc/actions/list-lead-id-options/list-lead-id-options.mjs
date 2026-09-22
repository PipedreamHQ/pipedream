import cinc from "../../cinc.app.mjs";

export default {
  key: "cinc-list-lead-id-options",
  name: "List Lead Identifier Options",
  description: "Retrieves available options for the Lead Identifier field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    cinc,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await cinc.propDefinitions.leadId.options.call(this.cinc, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
