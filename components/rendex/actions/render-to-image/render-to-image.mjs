import { ConfigurationError } from "@pipedream/platform";
import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-render-to-image",
  name: "Render to Image",
  description: "Render an HTML string or a page URL to an image (or PDF) via Rendex. Returns base64-encoded image data with metadata. [See the documentation](https://rendex.dev/docs/api-reference#post-screenshot-json).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rendex,
    html: {
      propDefinition: [
        rendex,
        "html",
      ],
    },
    url: {
      propDefinition: [
        rendex,
        "url",
      ],
    },
    format: {
      propDefinition: [
        rendex,
        "format",
      ],
    },
  },
  async run({ $ }) {
    // Rendex requires exactly one of `html` or `url` per request, so reject both
    // (not just neither) rather than silently dropping `url`.
    const hasHtml = Boolean(this.html);
    const hasUrl = Boolean(this.url);
    if (hasHtml === hasUrl) {
      throw new ConfigurationError("Provide exactly one of `html` or `url`.");
    }

    const data = {
      format: this.format || "png",
    };
    if (hasHtml) {
      data.html = this.html;
    } else {
      data.url = this.url;
    }

    const response = await this.rendex.renderJson({
      $,
      data,
    });

    const result = response.data;
    $.export("$summary", `Successfully rendered ${result?.format || "image"} (${result?.bytesSize ?? "unknown"} bytes)`);
    return result;
  },
};
