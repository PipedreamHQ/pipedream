import { ConfigurationError } from "@pipedream/platform";
import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-create-render-link",
  name: "Create Render Link",
  description: "Mint a signed, hosted render URL for a page or HTML — ideal for `og:image` tags. The returned URL serves the rendered image/PDF directly. [See the documentation](https://rendex.dev/docs/api-reference).",
  version: "0.0.1",
  type: "action",
  props: {
    rendex,
    url: {
      type: "string",
      label: "URL",
      description: "The page URL to render. Provide either `url` or `html`.",
      optional: true,
    },
    html: {
      propDefinition: [
        rendex,
        "html",
      ],
    },
    format: {
      propDefinition: [
        rendex,
        "format",
      ],
    },
    width: {
      propDefinition: [
        rendex,
        "width",
      ],
    },
    height: {
      propDefinition: [
        rendex,
        "height",
      ],
    },
    fullPage: {
      propDefinition: [
        rendex,
        "fullPage",
      ],
    },
    expiresIn: {
      propDefinition: [
        rendex,
        "expiresIn",
      ],
    },
  },
  async run({ $ }) {
    const hasHtml = Boolean(this.html);
    const hasUrl = Boolean(this.url);
    if (hasHtml === hasUrl) {
      throw new ConfigurationError("Provide exactly one of `html` or `url`.");
    }

    const response = await this.rendex.createRenderLink({
      $,
      data: {
        url: hasUrl
          ? this.url
          : undefined,
        html: hasHtml
          ? this.html
          : undefined,
        format: this.format,
        width: this.width,
        height: this.height,
        fullPage: this.fullPage,
        expiresIn: this.expiresIn,
      },
    });

    const data = response.data;
    $.export("$summary", `Created render link (expires ${data?.expiresAt})`);
    return data;
  },
};
