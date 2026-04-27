import docuwriterAi from "../../docuwriter_ai.app.mjs";

export default {
  key: "docuwriter_ai-generate-tests",
  name: "Generate Code Tests",
  description: "Generate unit or integration tests for a source code file. Consumes 1 credit per call. Requires workflow timeout of 5+ minutes for large files. [See the documentation](https://docs.docuwriter.ai/docuwriterai-api-docs/92068)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    openWorldHint: true,
    destructiveHint: false,
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
      description: "Optional hint for the test framework (e.g., `phpunit`, `jest`). Defaults to auto-detect.",
      optional: true,
    },
    testType: {
      type: "string",
      label: "Test Type",
      description: "Optional hint for the type of tests to generate (e.g., `unit tests`, `integration tests`). Defaults to `unit tests`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.docuwriterAi.generateCodeTests({
      $,
      data: {
        source_code: this.sourceCode,
        filename: this.filename,
        test_framework: this.testFramework,
        test_type: this.testType,
      },
    });
    $.export("$summary", `Tests generated for ${this.filename}`);
    return response;
  },
};
