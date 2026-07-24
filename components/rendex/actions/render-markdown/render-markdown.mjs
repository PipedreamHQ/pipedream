import { ConfigurationError } from "@pipedream/platform";
import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-render-markdown",
  name: "Render Markdown",
  description: "Render a Markdown string to an image or PDF via Rendex — clean default typography, no CSS required. Returns base64-encoded data with metadata. [See the documentation](https://rendex.dev/docs/api-reference#post-screenshot-json).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rendex,
    markdown: {
      propDefinition: [
        rendex,
        "markdown",
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
    if (!this.markdown) {
      throw new ConfigurationError("`markdown` is required.");
    }

    const data = {
      markdown: this.markdown,
      format: this.format || "png",
    };

    const response = await this.rendex.renderJson({
      $,
      data,
    });

    const result = response.data;
    $.export("$summary", `Successfully rendered ${result?.format || "image"} from Markdown (${result?.bytesSize ?? "unknown"} bytes)`);
    return result;
  },
};
