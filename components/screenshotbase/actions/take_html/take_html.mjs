import screenshotbase from "../../screenshotbase.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "screenshotbase-take-html",
  name: "Take from HTML",
  description: "Render a screenshot from raw HTML (served by Screenshotbase)",
  version: "0.1.0",
  type: "action",
  props: {
    screenshotbase,
    html: { label: "HTML", type: "string", optional: false },
    viewport_width: { label: "Viewport Width", type: "integer", optional: true, default: 800 },
    viewport_height: { label: "Viewport Height", type: "integer", optional: true, default: 400 },
    format: { label: "Format", type: "string", optional: true, options: ["jpg", "jpeg", "png", "gif"] },
  },
  async run({ $ }) {
    const base = this.screenshotbase.baseUrl();
    const params = {
      html: this.html,
      format: this.format,
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


