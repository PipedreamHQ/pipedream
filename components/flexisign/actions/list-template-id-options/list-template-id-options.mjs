import { flexisign } from "../../flexisign.app.mjs";

export default {
  key: "flexisign-list-template-id-options",
  name: "List Template ID Options",
  description: "Retrieves available options for the Template ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    flexisign,
  },
  async run({ $ }) {
    const options = await flexisign.propDefinitions.templateId.options.call(this.flexisign, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
