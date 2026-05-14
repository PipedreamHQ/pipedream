import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-list-record-type-options",
  name: "List Type Options",
  description: "Retrieves available options for the Type field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ironclad,
  },
  async run({ $ }) {
    const options = await ironclad.propDefinitions.recordType.options.call(this.ironclad);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
