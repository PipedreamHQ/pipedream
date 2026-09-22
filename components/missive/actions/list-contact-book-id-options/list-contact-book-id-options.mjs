import missive from "../../missive.app.mjs";

export default {
  key: "missive-list-contact-book-id-options",
  name: "List Contact Book ID Options",
  description: "Retrieves available options for the Contact Book ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    missive,
  },
  async run({ $ }) {
    const options = await missive.propDefinitions.contactBookId.options.call(this.missive);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
