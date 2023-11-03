import originality_ai from "../../originality_ai.app.mjs";

export default {
  key: "originality_ai-scan-content-for-plagiarism-and-readability",
  name: "Scan Content for Plagiarism and Readability",
  description: "Scans a string for plagiarism as well as readability. Ensure the string provided in `content` is encoded as UTF-8. [See the documentation](https://docs.originality.ai/api-v1-0-reference/scan/plagiarism-readability-scan)",
  version: "0.0.1",
  type: "action",
  props: {
    originality_ai,
    content: {
      propDefinition: [
        originality_ai,
        "content",
      ],
    },
    storescan: {
      propDefinition: [
        originality_ai,
        "storescan",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.originality_ai.scanStringForPlagiarismAndReadability({
      data: {
        content: this.content,
        storescan: this.storescan,
      },
    });
    $.export("$summary", "Successfully scanned content for plagiarism and readability");
    return response;
  },
};
