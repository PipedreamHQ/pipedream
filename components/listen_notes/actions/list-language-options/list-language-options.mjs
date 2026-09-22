import listen_notes from "../../listen_notes.app.mjs";

export default {
  key: "listen_notes-list-language-options",
  name: "List Language Options",
  description: "Retrieves available options for the Language field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    listen_notes,
  },
  async run({ $ }) {
    const options = await listen_notes.propDefinitions.language.options.call(this.listen_notes);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
