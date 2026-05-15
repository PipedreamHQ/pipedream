import lucca from "../../lucca.app.mjs";

export default {
  key: "lucca-list-nationality-id-options",
  name: "List Nationality Options",
  description: "Retrieves available options for the Nationality field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    lucca,
  },
  async run({ $ }) {
    const options = await lucca.propDefinitions.nationalityId.options.call(this.lucca);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
