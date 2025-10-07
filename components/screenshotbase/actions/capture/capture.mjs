import screenshotbase from "../../screenshotbase.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "screenshotbase-take",
  name: "Take Screenshot",
  description: "Render a website screenshot or PDF via Screenshotbase.",
  version: "0.1.1",
  type: "action",
  props: {
    screenshotbase,
    url: {
      label: "URL",
      type: "string",
      description: "Website to render",
      optional: false,
    },
    width: {
      type: "integer",
      label: "Width",
      optional: true,
      default: 1280,
    },
    height: {
      type: "integer",
      label: "Height",
      optional: true,
      default: 800,
    },
    format: {
      type: "string",
      label: "Format",
      description: "png | jpeg | pdf",
      optional: true,
      options: ["png", "jpeg", "pdf"],
    },
    fullPage: {
      type: "boolean",
      label: "Full Page",
      optional: true,
    },
    waitForSelector: {
      type: "string",
      label: "Wait for CSS Selector",
      optional: true,
    },
    omitBackground: {
      type: "boolean",
      label: "Transparent Background",
      optional: true,
    },
  },
  async run({ steps, $ }) {
    const base = this.screenshotbase.baseUrl();
    const params = {
      url: this.url,
      viewport_width: this.width,
      viewport_height: this.height,
      format: this.format,
      full_page: this.fullPage ? 1 : undefined,
    };
    const res = await axios($, {
      method: "GET",
      url: `${base}/v1/take`,
      headers: { apikey: this.screenshotbase.$auth.api_key },
      params,
    });
    $.export("result", res);
    return res;
  },
};


