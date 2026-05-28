import { repliq } from "../../repliq.app.mjs";

export default {
  key: "repliq-list-template-id-options",
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
    repliq,
  },
  async run({ $ }) {
    const options = await repliq.propDefinitions.templateId.options.call(this.repliq, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
