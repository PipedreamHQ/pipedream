import docuwriterAi from "../../docuwriter_ai.app.mjs";

export default {
  key: "docuwriter_ai-generate-swagger-api",
  name: "Generate Swagger/OpenAPI Spec",
  description: "Generate an OpenAPI/Swagger specification from source code. Consumes 1 credit per call. Requires workflow timeout of 5+ minutes for large files. [See the documentation](https://docs.docuwriter.ai/docuwriterai-api-docs/92065)",
  version: "0.0.1",
  type: "action",
  props: {
    docuwriter_ai: {
      type: "app",
      app: "docuwriter_ai",
    },
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
    const response = await this.docuwriter_ai.makeGenerationRequest($, {
      endpoint: "/generate-swagger-api",
      data: {
        source_code: this.sourceCode,
        filename: this.filename,
        additional_instructions: this.additionalInstructions,
      },
    });
    $.export("$summary", `Swagger/OpenAPI spec generated for ${this.filename}`);
    return response;
  },
};
