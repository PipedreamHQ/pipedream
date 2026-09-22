import evernote from "../../evernote.app.mjs";

export default {
  key: "evernote-list-tag-guids-options",
  name: "List Tag IDs Options",
  description: "Retrieves available options for the Tag IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    evernote,
  },
  async run({ $ }) {
    const options = await evernote.propDefinitions.tagGuids.options.call(this.evernote);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
