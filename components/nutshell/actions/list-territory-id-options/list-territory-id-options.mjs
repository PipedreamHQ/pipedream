import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-list-territory-id-options",
  name: "List Territory Id Options",
  description: "Retrieves available options for the Territory Id field.",
  version: "0.0.1",
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
    const options = await nutshell.propDefinitions.territoryId.options.call(this.nutshell, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
