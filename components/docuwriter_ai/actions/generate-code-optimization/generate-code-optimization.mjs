import docuwriterAi from "../../docuwriter_ai.app.mjs";

export default {
  key: "docuwriter_ai-generate-code-optimization",
  name: "Generate Code Optimization",
  description: "Generate optimization suggestions and improved code for a source file. Consumes 1 credit per call. Requires workflow timeout of 5+ minutes for large files. [See the documentation](https://docs.docuwriter.ai/docuwriterai-api-docs/92062)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    docuwriterAi,
    sourceCode: {
      propDefinition: [
        docuwriterAi,
        "sourceCode",
      ],
    },
    filename: {
      propDefinition: [
        docuwriterAi,
        "filename",
      ],
    },
    additionalInstructions: {
      propDefinition: [
        docuwriterAi,
        "additionalInstructions",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.docuwriterAi.generateCodeOptimization($, {
      source_code: this.sourceCode,
      filename: this.filename,
      additional_instructions: this.additionalInstructions,
    });
    $.export("$summary", `Code optimization generated for ${this.filename}`);
    return response;
  },
};
