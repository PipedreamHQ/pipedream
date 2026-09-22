import akeneo from "../../akeneo.app.mjs";

export default {
  key: "akeneo-list-media-file-attribute-code-options",
  name: "List Media File Attribute Code Options",
  description: "Retrieves available options for the Media File Attribute Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    akeneo,
    page: {
      propDefinition: [
        akeneo,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const options = await akeneo.propDefinitions.mediaFileAttributeCode.options
      .call(this.akeneo, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
