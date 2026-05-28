import airmeet from "../../airmeet.app.mjs";

export default {
  key: "airmeet-list-airmeet-id-options",
  name: "List Airmeet ID Options",
  description: "Retrieves available options for the Airmeet ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    airmeet,
  },
  async run({ $ }) {
    const options = await airmeet.propDefinitions.airmeetId.options.call(this.airmeet, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
