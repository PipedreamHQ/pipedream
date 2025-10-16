import niceboard from "../../niceboard.app.mjs";

export default {
  key: "niceboard-create-category",
  name: "Create Category",
  description: "Creates a new job category within Niceboard.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    niceboard,
    niceboardUrl: {
      propDefinition: [
        niceboard,
        "niceboardUrl",
      ],
    },
    name: {
      type: "string",
      label: "Category Name",
      description: "The name of the job category to be created",
    },
  },
  async run({ $ }) {
    const response = await this.niceboard.createCategory({
      $,
      niceboardUrl: this.niceboardUrl,
      data: {
        name: this.name,
      },
    });
    $.export("$summary", `Successfully created category with name "${this.name}"`);
    return response;
  },
};
