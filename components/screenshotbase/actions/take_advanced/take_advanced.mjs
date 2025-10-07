import screenshotbase from "../../screenshotbase.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "screenshotbase-take-advanced",
  name: "Take Screenshot (Advanced)",
  description: "Render a website with full set of parameters (format, quality, full_page, viewport)",
  version: "0.1.0",
  type: "action",
  props: {
    screenshotbase,
    url: { label: "URL", type: "string", optional: false },
    format: { label: "Format", type: "string", optional: true, options: ["jpg", "jpeg", "png", "gif"] },
    quality: { label: "Quality (jpg/jpeg only)", type: "integer", optional: true },
    full_page: { label: "Full Page", type: "boolean", optional: true },
    viewport_width: { label: "Viewport Width", type: "integer", optional: true, default: 1280 },
    viewport_height: { label: "Viewport Height", type: "integer", optional: true, default: 800 },
  },
  async run({ $ }) {
    const base = this.screenshotbase.baseUrl();
    const params = {
      url: this.url,
      format: this.format,
      quality: this.quality,
      full_page: this.full_page ? 1 : undefined,
      viewport_width: this.viewport_width,
      viewport_height: this.viewport_height,
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


