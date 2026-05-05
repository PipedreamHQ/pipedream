import docuwriterAi from "../../docuwriter_ai.app.mjs";

export default {
  key: "docuwriter_ai-generate-documentation",
  name: "Generate Code Documentation",
  description: "Generate AI-powered documentation for a source code file. Consumes 1 Docuwriter credit. Requires workflow timeout of 5+ minutes for large files. [See the documentation](https://docs.docuwriter.ai/docuwriterai-api-docs/92064)",
  version: "0.0.2",
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
      description: "Language for generated docs (e.g., `English`, `Spanish`, `German`)",
      optional: true,
      default: "English",
    },
    documentationType: {
      type: "string",
      label: "Documentation Type",
      description: "Documentation style to generate (e.g., `General Documentation`, `API Reference`, `Inline Comments`)",
      optional: true,
      default: "General Documentation",
    },
    additionalInstructions: {
      propDefinition: [
        docuwriterAi,
        "additionalInstructions",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Custom title for this generation (max 255 chars).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.docuwriterAi.generateDocumentation($, {
      source_code: this.sourceCode,
      filename: this.filename,
      output_language: this.outputLanguage,
      documentation_type: this.documentationType,
      additional_instructions: this.additionalInstructions,
      name: this.name,
    });
    $.export("$summary", `Documentation generated for ${this.filename}`);
    return response;
  },
};
