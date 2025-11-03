import app from "../../inksprout.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "inksprout-create-summary",
  name: "Create Summary",
  description: "Create summary by either url or raw text. [See the docs](https://inksprout.co/docs/index.html#item-2-2).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "Website link to summarize. Optional if text is passed.",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "Text to summarize. Optional if url is passed.",
      optional: true,
    },
  },
  async run({ $ }) {
    const param = {
      url: this.url,
      text: this.text,
    };
    if (!param.url && !param.text) {
      throw new ConfigurationError("Either url or text is required.");
    }
    const result = await this.app.createSummary($, param);
    $.export("$summary", `Summarized text with status: ${result.status}`);
    return result;
  },
};
