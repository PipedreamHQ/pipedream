import screenshotbase from "../../screenshotbase.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "screenshotbase-take-pdf",
  name: "Take PDF",
  description: "Render a PDF from a website URL",
  version: "0.1.0",
  type: "action",
  props: {
    screenshotbase,
    url: { label: "URL", type: "string", optional: false },
    viewport_width: { label: "Viewport Width", type: "integer", optional: true, default: 1280 },
    viewport_height: { label: "Viewport Height", type: "integer", optional: true, default: 800 },
  },
  async run({ $ }) {
    const base = this.screenshotbase.baseUrl();
    const params = {
      url: this.url,
      format: "pdf",
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


