import convenia from "../../convenia.app.mjs";

export default {
  key: "convenia-list-absence-type-id-options",
  name: "List Absence Type ID Options",
  description: "Retrieves available options for the Absence Type ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    convenia,
  },
  async run({ $ }) {
    const options = await convenia.propDefinitions.absenceTypeId.options.call(this.convenia);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
