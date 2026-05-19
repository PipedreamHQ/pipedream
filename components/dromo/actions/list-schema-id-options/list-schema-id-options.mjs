import dromo from "../../dromo.app.mjs";

export default {
  key: "dromo-list-schema-id-options",
  name: "List Schema Options",
  description: "Retrieves available options for the Schema field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dromo,
  },
  async run({ $ }) {
    const options = await dromo.propDefinitions.schemaId.options.call(this.dromo);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
