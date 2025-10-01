import craftmypdf from "../../craftmypdf.app.mjs";

export default {
  key: "craftmypdf-create-image",
  name: "Create Image",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new image. [See the documentation](https://craftmypdf.com/docs/index.html#tag/PDF-Generation-API/operation/create-parallel)",
  type: "action",
  props: {
    craftmypdf,
    data: {
      propDefinition: [
        craftmypdf,
        "data",
      ],
    },
    loadDataFrom: {
      propDefinition: [
        craftmypdf,
        "loadDataFrom",
      ],
      optional: true,
    },
    templateId: {
      propDefinition: [
        craftmypdf,
        "templateId",
      ],
    },
    version: {
      propDefinition: [
        craftmypdf,
        "templateVersion",
        ({ templateId }) => ({
          templateId,
        }),
      ],
      optional: true,
    },
    expiration: {
      propDefinition: [
        craftmypdf,
        "expiration",
      ],
      optional: true,
    },
    outputFile: {
      propDefinition: [
        craftmypdf,
        "outputFile",
      ],
      optional: true,
    },
    outputType: {
      type: "string",
      label: "Output Type",
      description: "Image output file type.",
      options: [
        "jpeg",
        "png",
      ],
      optional: true,
    },
    cloudStorage: {
      propDefinition: [
        craftmypdf,
        "cloudStorage",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      craftmypdf,
      loadDataFrom,
      templateId,
      outputFile,
      outputType,
      cloudStorage,
      ...data
    } = this;

    const response = await craftmypdf.createImage({
      $,
      data: {
        ...data,
        load_data_from: loadDataFrom,
        template_id: templateId,
        export_type: "json",
        output_file: outputFile,
        output_type: outputType,
        cloud_storage: cloudStorage,
      },
    });

    $.export("$summary", `A new image with Id: ${response.transaction_ref} was successfully created!`);
    return response;
  },
};
