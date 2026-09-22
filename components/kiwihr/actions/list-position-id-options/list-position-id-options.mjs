import kiwihr from "../../kiwihr.app.mjs";

export default {
  key: "kiwihr-list-position-id-options",
  name: "List Position ID Options",
  description: "Retrieves available options for the Position ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kiwihr,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await kiwihr.propDefinitions.positionId.options.call(this.kiwihr, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
