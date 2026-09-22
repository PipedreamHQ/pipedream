import timetonic from "../../timetonic.app.mjs";

export default {
  key: "timetonic-list-book-code-options",
  name: "List Book Code Options",
  description: "Retrieves available options for the Book Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    timetonic,
  },
  async run({ $ }) {
    const options = await timetonic.propDefinitions.bookCode.options.call(this.timetonic);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
