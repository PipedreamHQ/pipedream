import common from "../common/common.mjs";

export default {
  ...common,
  key: "cradl_ai-parse-document",
  name: "Parse Document",
  description: "Parses data from a document using a custom selected model. [See the documentation](https://docs.cradl.ai/integrations/rest-api)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    modelId: {
      propDefinition: [
        common.props.cradlAi,
        "modelId",
      ],
    },
  },
  async run({ $ }) {
    const {
      documentId, fileUrl,
    } = await this.createDocumentHandle($);
    await this.uploadFile($, fileUrl);
    const result = await this.cradlAi.createPrediction({
      $,
      data: {
        documentId,
        modelId: this.modelId,
      },
    });
    $.export("$summary", `Successfully parsed document with ID: ${documentId}`);
    return result;
  },
};
