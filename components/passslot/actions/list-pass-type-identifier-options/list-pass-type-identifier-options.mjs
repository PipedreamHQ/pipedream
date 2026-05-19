import passslot from "../../passslot.app.mjs";

export default {
  key: "passslot-list-pass-type-identifier-options",
  name: "List Pass Type Identifier Options",
  description: "Retrieves available options for the Pass Type Identifier field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    passslot,
  },
  async run({ $ }) {
    const options = await passslot.propDefinitions.passTypeIdentifier.options.call(this.passslot);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
