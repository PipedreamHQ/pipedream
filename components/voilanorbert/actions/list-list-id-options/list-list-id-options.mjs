import voilanorbert from "../../voilanorbert.app.mjs";

export default {
  key: "voilanorbert-list-list-id-options",
  name: "List List ID Options",
  description: "Retrieves available options for the List ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    voilanorbert,
  },
  async run({ $ }) {
    const options = await voilanorbert.propDefinitions.listId.options.call(this.voilanorbert);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
