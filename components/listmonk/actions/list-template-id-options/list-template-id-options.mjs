import listmonk from "../../listmonk.app.mjs";

export default {
  key: "listmonk-list-template-id-options",
  name: "List Template Options",
  description: "Retrieves available options for the Template field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    listmonk,
  },
  async run({ $ }) {
    const options = await listmonk.propDefinitions.templateId.options.call(this.listmonk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
