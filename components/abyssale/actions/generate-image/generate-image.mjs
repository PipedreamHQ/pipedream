import abyssale from "../../abyssale.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "abyssale-generate-image",
  name: "Generate Image",
  description: "Generates a single image from a template. [See the documentation](https://api-reference.abyssale.com/#tag/Images/paths/~1banner-builder~1%7BtemplateId%7D~1generate/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    abyssale,
    templateId: {
      propDefinition: [
        abyssale,
        "templateId",
      ],
    },
    templateFormatName: {
      propDefinition: [
        abyssale,
        "templateFormatName",
        (c) => ({
          templateId: c.templateId,
        }),
      ],
    },
    elements: {
      propDefinition: [
        abyssale,
        "elements",
      ],
    },
  },
  methods: {
    generateImage({
      templateId, ...args
    }) {
      return this.abyssale.post({
        path: `/banner-builder/${templateId}/generate`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      generateImage,
      templateId,
      templateFormatName,
      elements,
    } = this;

    const response = await generateImage({
      templateId,
      data: {
        template_format_name: templateFormatName,
        elements: utils.parseElements(elements),
      },
    });

    $.export("$summary", `Successfully generated image with ID: \`${response.id}\``);

    return response;
  },
};
