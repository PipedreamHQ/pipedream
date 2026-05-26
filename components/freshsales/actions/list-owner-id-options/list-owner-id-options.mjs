import freshsales from "../../freshsales.app.mjs";

export default {
  key: "freshsales-list-owner-id-options",
  name: "List Owner ID Options",
  description: "Retrieves available options for the Owner ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    freshsales,
  },
  async run({ $ }) {
    const options = await freshsales.propDefinitions.ownerId.options.call(this.freshsales);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
