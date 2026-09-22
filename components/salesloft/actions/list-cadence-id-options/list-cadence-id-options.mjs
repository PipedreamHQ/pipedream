import salesloft from "../../salesloft.app.mjs";

export default {
  key: "salesloft-list-cadence-id-options",
  name: "List Cadence ID Options",
  description: "Retrieves available options for the Cadence ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    salesloft,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await salesloft.propDefinitions.cadenceId.options.call(this.salesloft, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
