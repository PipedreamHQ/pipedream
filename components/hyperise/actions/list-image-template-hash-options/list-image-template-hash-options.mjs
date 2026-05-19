import hyperise from "../../hyperise.app.mjs";

export default {
  key: "hyperise-list-image-template-hash-options",
  name: "List Image Template Hash Options",
  description: "Retrieves available options for the Image Template Hash field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hyperise,
  },
  async run({ $ }) {
    const options = await hyperise.propDefinitions.imageTemplateHash.options.call(this.hyperise);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
