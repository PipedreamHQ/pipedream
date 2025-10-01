import common from "../common/common.mjs";

export default {
  ...common,
  key: "cradl_ai-parse-document-human-in-loop",
  name: "Parse Document with Human in the Loop",
  description: "Sends a document to an existing flow for human-in-the-loop processing. [See the documentation](https://docs.cradl.ai/integrations/rest-api)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    workflowId: {
      propDefinition: [
        common.props.cradlAi,
        "workflowId",
      ],
    },
  },
  async run({ $ }) {
    const {
      documentId, fileUrl,
    } = await this.createDocumentHandle($);
    await this.uploadFile($, fileUrl);
    const { executionId } = await this.cradlAi.runWorkflow({
      $,
      workflowId: this.workflowId,
      data: {
        input: {
          documentId,
        },
      },
    });
    const result = await this.cradlAi.getRunResult({
      $,
      workflowId: this.workflowId,
      executionId,
    });
    $.export("$summary", `Successfully parsed document with ID: ${documentId}`);
    return result;
  },
};
