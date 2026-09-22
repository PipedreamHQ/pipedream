import papyrs from "../../papyrs.app.mjs";

export default {
  key: "papyrs-list-page-options",
  name: "List Page Options",
  description: "Retrieves available options for the Page field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    papyrs,
  },
  async run({ $ }) {
    const options = await papyrs.propDefinitions.page.options.call(this.papyrs);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
