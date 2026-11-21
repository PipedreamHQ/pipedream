import whatsable from "../../whatsable.app.mjs";

export default {
  name: "Create Label",
  description: "Create a Whatsable label with required color and optional description, keywords, and number restrictions",
  key: "whatsable-create-label",
  version: "0.0.2",
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
      description: "Unique label name (up to 60 characters)",
    },
    color: {
      type: "string",
      label: "Color",
      description: "Required label color value as accepted by Whatsable",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional description (up to 280 characters)",
      optional: true,
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "Optional keyword list for label automation",
      optional: true,
    },
    number_ids: {
      type: "string[]",
      label: "Number IDs",
      description: "Optional number IDs to restrict this label to. Omit for all numbers.",
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
        color: this.color,
        ...(this.description
          ? {
            description: this.description,
          }
          : {}),
        ...(this.keywords?.length
          ? {
            keywords: this.keywords,
          }
          : {}),
        ...(this.number_ids?.length
          ? {
            number_ids: this.number_ids,
          }
          : {}),
      },
    });
    $.export("$summary", `Created label "${this.name}"`);
    return response;
  },
};
