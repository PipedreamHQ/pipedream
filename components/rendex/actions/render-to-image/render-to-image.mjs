import { ConfigurationError } from "@pipedream/platform";
import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-render-to-image",
  name: "Render to Image",
  description: "Render an HTML string or a page URL to an image (or PDF) via Rendex. Returns base64-encoded image data with metadata. [See the documentation](https://rendex.dev/docs/api-reference#post-screenshot-json).",
  version: "0.1.0",
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
    geo: {
      propDefinition: [
        rendex,
        "geo",
      ],
    },
    geoCity: {
      propDefinition: [
        rendex,
        "geoCity",
      ],
    },
    geoState: {
      propDefinition: [
        rendex,
        "geoState",
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

    const data = {
      format: this.format || "png",
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
      geo: this.geo,
      geoCity: this.geoCity,
      geoState: this.geoState,
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
