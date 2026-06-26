import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-list-lead-id-options",
  name: "List Lead ID Options",
  description: "Retrieves available options for the Lead ID field.",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    nutshell,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await nutshell.propDefinitions.leadId.options.call(this.nutshell, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
