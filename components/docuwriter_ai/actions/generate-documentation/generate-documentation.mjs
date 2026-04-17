import docuwriterAi from "../../docuwriter_ai.app.mjs";

export default {
  key: "docuwriter_ai-generate-documentation",
  name: "Generate Code Documentation",
  description: "Generate AI-powered documentation for a source code file. Consumes 1 credit per call. Requires workflow timeout of 5+ minutes for large files. [See the documentation](https://docs.docuwriter.ai/docuwriterai-api-docs/92064)",
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
    outputLanguage: {
      type: "string",
      label: "Output Language",
      description: "The language for the generated documentation",
      optional: true,
      default: "English",
    },
    documentationType: {
      type: "string",
      label: "Documentation Type",
      description: "The type of documentation to generate",
      optional: true,
      default: "General Documentation",
    },
    additionalInstructions: {
      propDefinition: [
        docuwriterAi,
        "additionalInstructions",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.docuwriterAi.generateDocumentation($, {
      source_code: this.sourceCode,
      filename: this.filename,
      output_language: this.outputLanguage,
      documentation_type: this.documentationType,
      additional_instructions: this.additionalInstructions,
    });
    $.export("$summary", `Documentation generated for ${this.filename}`);
    return response;
  },
};
