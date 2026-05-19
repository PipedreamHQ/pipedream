import fakturoid from "../../fakturoid.app.mjs";

export default {
  key: "fakturoid-list-account-slug-options",
  name: "List Account Options",
  description: "Retrieves available options for the Account field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fakturoid,
  },
  async run({ $ }) {
    const options = await fakturoid.propDefinitions.accountSlug.options.call(this.fakturoid);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
