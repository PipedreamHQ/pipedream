import abyssale from "../../abyssale.app.mjs";

export default {
  key: "abyssale-generate-gif",
  name: "Generate Animated Gif",
  description: "Generates an animated gif. [See the documentation](https://developers.abyssale.com/rest-api/generation/generate-animated-gifs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    abyssale,
    templateId: {
      propDefinition: [
        abyssale,
        "templateId",
      ],
    },
    elements: {
      propDefinition: [
        abyssale,
        "elements",
      ],
    },
    imageFileType: {
      propDefinition: [
        abyssale,
        "imageFileType",
      ],
    },
    callbackUrl: {
      propDefinition: [
        abyssale,
        "callbackUrl",
      ],
    },
    templateFormatNames: {
      type: "string[]",
      label: "Template Format Names",
      description: "The names of the template formats",
      optional: true,
    },
  },
  methods: {
    async generateAnimatedGif({
      templateId,
      callbackUrl,
      elements,
      imageFileType,
      templateFormatNames,
    }) {
      return this.abyssale._makeRequest({
        method: "POST",
        path: `/async/banner-builder/${templateId}/generate`,
        data: {
          callback_url: callbackUrl,
          image_file_type: imageFileType,
          gif: {
            max_fps: 9,
            repeat: -1,
          },
          template_format_names: templateFormatNames,
          elements,
        },
      });
    },
  },
  async run({ $ }) {
    const response = await this.generateAnimatedGif({
      templateId: this.templateId,
      callbackUrl: this.callbackUrl,
      elements: this.elements,
      imageFileType: this.imageFileType,
      templateFormatNames: this.templateFormatNames,
    });
    $.export("$summary", `Generated animated gif with ID: ${response.generation_request_id}`);
    return response;
  },
};
