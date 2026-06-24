import { axios } from "@pipedream/platform";
import app from "../../ai_readiness.app.mjs";

export default {
  key: "ai_readiness-check-ai-readiness",
  name: "Check AI Search Readiness",
  description: "Check whether a website is visible to AI search engines (ChatGPT, Perplexity, Claude, Google AI Overviews). Returns a 0-100 score, a grade, and a specific fix for each gap. [See the docs](https://samedaydesk.com/tools/ai-readiness).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "The website to check, e.g. `example.com` or `https://example.com`.",
    },
  },
  async run({ $ }) {
    const data = await axios($, {
      url: "https://samedaydesk.com/api/tools/ai-readiness",
      params: {
        url: this.url,
      },
    });
    $.export("$summary", `Checked ${this.url} — score ${data.score}/100 (grade ${data.grade})`);
    return data;
  },
};
