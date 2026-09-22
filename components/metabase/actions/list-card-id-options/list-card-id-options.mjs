import metabase from "../../metabase.app.mjs";

export default {
  key: "metabase-list-card-id-options",
  name: "List Card ID Options",
  description: "Retrieves available options for the Card ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    metabase,
  },
  async run({ $ }) {
    const options = await metabase.propDefinitions.cardId.options.call(this.metabase);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
