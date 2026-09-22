import nexweave from "../../nexweave.app.mjs";

export default {
  key: "nexweave-list-image-template-id-options",
  name: "List Image Template ID Options",
  description: "Retrieves available options for the Image Template ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    nexweave,
  },
  async run({ $ }) {
    const options = await nexweave.propDefinitions.imageTemplateId.options.call(this.nexweave);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
