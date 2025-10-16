import imagior from "../../imagior.app.mjs";

export default {
  key: "imagior-generate-image",
  name: "Generate Image",
  description: "Generates a unique and robust image using a provided template. [See the documentation](https://docs.imagior.com/api-reference/image-generate)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    imagior,
    templateId: {
      propDefinition: [
        imagior,
        "templateId",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.templateId) {
      return props;
    }
    const { elements } = await this.imagior.listTemplateElements({
      templateId: this.templateId,
    });
    for (const [
      key,
      value,
    ] of Object.entries(elements)) {
      props[`customize_${key}`] = {
        type: "boolean",
        label: `Customize ${key}`,
        optional: true,
        reloadProps: true,
      };
      if (this[`customize_${key}`]) {
        for (const elementKey of Object.keys(value)) {
          props[`${key}_${elementKey}`] = {
            type: "string",
            label: `${key} - ${elementKey}`,
            optional: true,
          };
        }
      }
    }
    return props;
  },
  async run({ $ }) {
    const elements = {};
    const { elements: allElements } = await this.imagior.listTemplateElements({
      $,
      templateId: this.templateId,
    });
    for (const [
      key,
      value,
    ] of Object.entries(allElements)) {
      if (!this[`customize_${key}`]) {
        continue;
      }
      elements[key] = {};
      for (const elementKey of Object.keys(value)) {
        if (this[`${key}_${elementKey}`]) {
          elements[key][elementKey] = this[`${key}_${elementKey}`];
        }
      }
    }

    const response = await this.imagior.generateImage({
      $,
      data: {
        templateId: this.templateId,
        elements,
      },
    });
    $.export("$summary", `${response.message}`);
    return response;
  },
};
