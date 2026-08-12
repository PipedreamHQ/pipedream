// x-pd-ai: optimized
import mintlify from "../../mintlify.app.mjs";

export default {
  key: "mintlify-detect-ai-prose",
  name: "Detect AI-sounding Prose",
  description: "Analyze a documentation page for AI-generated prose and get suggested human rewrites for flagged passages. Consumes 1 AI credit per page checked. Pages under 50 words return `skipped: \"too_short\"` with `creditsCharged: 0`. Limited to 30 requests per minute per IP address; a 503 response means the detection service is temporarily unavailable and no credit is charged. [See the documentation](https://www.mintlify.com/docs/api-reference/admin/deslop)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mintlify,
    path: {
      type: "string",
      label: "Path",
      description: "Repo-relative file path for reporting, e.g. `guides/quickstart.mdx`.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "Raw MDX/Markdown content to analyze, up to 1,000,000 characters.",
    },
  },
  async run({ $ }) {
    const response = await this.mintlify.detectAiProse({
      $,
      data: {
        path: this.path,
        content: this.content,
      },
    });

    $.export("$summary", response.skipped
      ? `Skipped "${this.path}" — ${response.skipped}`
      : `Analyzed "${this.path}" — prediction: "${response.predictionShort}"`);

    return response;
  },
};
