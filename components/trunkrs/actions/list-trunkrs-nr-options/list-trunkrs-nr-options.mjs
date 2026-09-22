import trunkrs from "../../trunkrs.app.mjs";

export default {
  key: "trunkrs-list-trunkrs-nr-options",
  name: "List Trunkrs Number Options",
  description: "Retrieves available options for the Trunkrs Number field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trunkrs,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await trunkrs.propDefinitions.trunkrsNr.options.call(this.trunkrs, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
