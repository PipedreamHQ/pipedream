import abyssale from "../../abyssale.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "abyssale-generate-multi-format-images-videos",
  name: "Generate Multi-Format Images/Videos",
  description: "Generates multiple images and videos from a template. [See the documentation](https://api-reference.abyssale.com/#tag/Images/paths/~1async~1banner-builder~1%7BtemplateId%7D~1generate/post)",
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
    templateFormatNames: {
      type: "string[]",
      label: "Template Format Names",
      description: "The names of the template formats",
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
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "The URL that will be called once the generation of your export is done",
      optional: true,
    },
  },
  methods: {
    generateMultiFormatImagesVideos({
      templateId, ...args
    }) {
      return this.abyssale.post({
        path: `/async/banner-builder/${templateId}/generate`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      generateMultiFormatImagesVideos,
      templateId,
      templateFormatNames,
      elements,
      callbackUrl,
    } = this;

    const response = await generateMultiFormatImagesVideos({
      templateId,
      data: {
        template_format_names: templateFormatNames,
        elements: utils.parseElements(elements),
        callback_url: callbackUrl,
      },
    });

    $.export("$summary", `Successfully generated image with ID: \`${response.generation_request_id}\``);

    return response;
  },
};
