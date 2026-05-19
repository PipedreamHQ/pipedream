import publisherkit from "../../publisherkit.app.mjs";

export default {
  key: "publisherkit-list-template-id-options",
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
    publisherkit,
  },
  async run({ $ }) {
    const options = await publisherkit.propDefinitions.templateId.options.call(this.publisherkit);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
