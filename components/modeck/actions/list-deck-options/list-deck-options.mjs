import modeck from "../../modeck.app.mjs";

export default {
  key: "modeck-list-deck-options",
  name: "List Deck Name Options",
  description: "Retrieves available options for the Deck Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    modeck,
  },
  async run({ $ }) {
    const options = await modeck.propDefinitions.deck.options.call(this.modeck);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
