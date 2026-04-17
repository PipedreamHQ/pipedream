import docuwriterAi from "../../docuwriter_ai.app.mjs";

export default {
  key: "docuwriter_ai-generate-tests",
  name: "Generate Code Tests",
  description: "Generate unit or integration tests for a source code file. Consumes 1 credit per call. Requires workflow timeout of 5+ minutes for large files. [See the documentation](https://docs.docuwriter.ai/docuwriterai-api-docs/92068)",
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
    testFramework: {
      type: "string",
      label: "Test Framework",
      description: "The test framework to use (e.g., `PHPUnit`, `Jest`, `Pytest`)",
      optional: true,
    },
    testType: {
      type: "string",
      label: "Test Type",
      description: "The type of tests to generate (e.g., `unit`, `integration`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.docuwriterAi.generateTests($, {
      source_code: this.sourceCode,
      filename: this.filename,
      test_framework: this.testFramework,
      test_type: this.testType,
    });
    $.export("$summary", `Tests generated for ${this.filename}`);
    return response;
  },
};
