import whatsable from "../../whatsable.app.mjs";

export default {
  name: "Create Label",
  description: "Create a new label in Whatsable",
  key: "whatsable-create-label",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },

  props: {
    whatsable,
    name: {
      type: "string",
      label: "Label Name",
      description: "Name of the label",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional description for the label",
      optional: true,
    },
  },

  async run({ $ }) {
    const response = await this.whatsable._makeRequest({
      $,
      method: "POST",
      path: "/labels",
      data: {
        name: this.name,
        ...(this.description
          ? {
            description: this.description,
          }
          : {}),
      },
    });

    $.export("$summary", `Created label "${this.name}"`);

    return response;
  },
};
