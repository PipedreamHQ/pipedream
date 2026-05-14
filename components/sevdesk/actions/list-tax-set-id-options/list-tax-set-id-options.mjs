import sevdesk from "../../sevdesk.app.mjs";

export default {
  key: "sevdesk-list-tax-set-id-options",
  name: "List Tax Set Id Options",
  description: "Retrieves available options for the Tax Set Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sevdesk,
  },
  async run({ $ }) {
    const options = await sevdesk.propDefinitions.taxSetId.options.call(this.sevdesk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
