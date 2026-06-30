import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-list-fields-options",
  name: "List Fields Options",
  description: "Retrieves available options for the Fields field.",
  version: "0.0.5",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zendesk,
  },
  async run({ $ }) {
    const options = await zendesk.propDefinitions.fields.options.call(this.zendesk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
