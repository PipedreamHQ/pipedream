import { ConfigurationError } from "@pipedream/platform";
import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-create-render-link",
  name: "Create Render Link",
  description: "Mint a signed, hosted render URL for a page or HTML — ideal for `og:image` tags. The returned URL serves the rendered image/PDF directly. [See the documentation](https://rendex.dev/docs/api-reference#post-render-link).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    quality: {
      propDefinition: [
        rendex,
        "quality",
      ],
    },
    delay: {
      propDefinition: [
        rendex,
        "delay",
      ],
    },
    darkMode: {
      propDefinition: [
        rendex,
        "darkMode",
      ],
    },
    deviceScaleFactor: {
      propDefinition: [
        rendex,
        "deviceScaleFactor",
      ],
    },
    device: {
      propDefinition: [
        rendex,
        "device",
      ],
    },
    selector: {
      propDefinition: [
        rendex,
        "selector",
      ],
    },
    hideSelectors: {
      propDefinition: [
        rendex,
        "hideSelectors",
      ],
    },
    blockAds: {
      propDefinition: [
        rendex,
        "blockAds",
      ],
    },
    blockCookieBanners: {
      propDefinition: [
        rendex,
        "blockCookieBanners",
      ],
    },
    timeout: {
      propDefinition: [
        rendex,
        "timeout",
      ],
    },
    waitUntil: {
      propDefinition: [
        rendex,
        "waitUntil",
      ],
    },
    bestAttempt: {
      propDefinition: [
        rendex,
        "bestAttempt",
      ],
    },
    css: {
      propDefinition: [
        rendex,
        "css",
      ],
    },
    js: {
      propDefinition: [
        rendex,
        "js",
      ],
    },
    userAgent: {
      propDefinition: [
        rendex,
        "userAgent",
      ],
    },
    cookies: {
      propDefinition: [
        rendex,
        "cookies",
      ],
    },
    headers: {
      propDefinition: [
        rendex,
        "headers",
      ],
    },
    pdfFormat: {
      propDefinition: [
        rendex,
        "pdfFormat",
      ],
    },
    pdfLandscape: {
      propDefinition: [
        rendex,
        "pdfLandscape",
      ],
    },
    pdfPrintBackground: {
      propDefinition: [
        rendex,
        "pdfPrintBackground",
      ],
    },
    pdfScale: {
      propDefinition: [
        rendex,
        "pdfScale",
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

    let cookies;
    if (this.cookies?.length) {
      try {
        cookies = this.cookies.map((cookie) => {
          const parsed = typeof cookie === "string"
            ? JSON.parse(cookie)
            : cookie;
          if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            throw new Error("Invalid cookie shape");
          }
          return parsed;
        });
      } catch {
        throw new ConfigurationError("Each cookie must be a JSON object, e.g. {\"name\":\"session\",\"value\":\"abc\"}.");
      }
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
        quality: this.quality,
        delay: this.delay,
        darkMode: this.darkMode,
        deviceScaleFactor: this.deviceScaleFactor !== undefined
          ? Number(this.deviceScaleFactor)
          : undefined,
        device: this.device,
        selector: this.selector,
        hideSelectors: this.hideSelectors,
        blockAds: this.blockAds,
        blockCookieBanners: this.blockCookieBanners,
        timeout: this.timeout,
        waitUntil: this.waitUntil,
        bestAttempt: this.bestAttempt,
        css: this.css,
        js: this.js,
        userAgent: this.userAgent,
        cookies,
        headers: this.headers,
        pdfFormat: this.pdfFormat,
        pdfLandscape: this.pdfLandscape,
        pdfPrintBackground: this.pdfPrintBackground,
        pdfScale: this.pdfScale !== undefined
          ? Number(this.pdfScale)
          : undefined,
        expiresIn: this.expiresIn,
      },
    });

    const data = response.data;
    $.export("$summary", `Created render link (expires ${data?.expiresAt})`);
    return data;
  },
};
