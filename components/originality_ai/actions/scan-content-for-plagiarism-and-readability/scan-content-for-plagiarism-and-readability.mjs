import app from "../../originality_ai.app.mjs";

export default {
  key: "originality_ai-scan-content-for-plagiarism-and-readability",
  name: "Scan Content for Plagiarism and Readability",
  description: "Scans a string for plagiarism as well as readability. [See the documentation](https://docs.originality.ai/api-v1-0-reference/scan/plagiarism-readability-scan)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    content: {
      propDefinition: [
        app,
        "content",
      ],
    },
    storeScan: {
      propDefinition: [
        app,
        "storeScan",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    excludedUrl: {
      propDefinition: [
        app,
        "excludedUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.scanStringForPlagiarismAndReadability({
      $,
      data: {
        content: this.content,
        excludedUrl: this.excludedUrl,
        title: this.title,
        storeScan: this.storeScan === false
          ? "false"
          : undefined,
      },
    });
    $.export("$summary", "Successfully scanned content for plagiarism and readability");
    return response;
  },
};
