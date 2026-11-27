import { ConfigurationError } from "@pipedream/platform";
import urlchart from "../../urlchart.app.mjs";
import {
  formatErrorDetail, normalizeChartParams,
} from "../../common/utils.mjs";

const DEFAULT_CONTENT_TYPE = "image/png";

export default {
  key: "urlchart-create-chart-image",
  name: "Create Chart Image",
  description: "Render a chart image (PNG) from legacy Google Image Charts parameters, e.g. a stacked bar chart of monthly sales. Returns the image as base64 so a later step can upload, attach or email it. The free tier works without an API key; connecting a key raises the size limits and the render quota. [See the documentation](https://urlchart.com/docs/parameters)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    urlchart,
    params: {
      propDefinition: [
        urlchart,
        "params",
      ],
    },
  },
  async run({ $ }) {
    const params = normalizeChartParams(this.params);
    if (!params) {
      throw new ConfigurationError("Chart Parameters is empty. Pass legacy Google Image Charts parameters, e.g. `cht=bvs&chs=600x400&chd=t:10,20,30`.");
    }

    let response;
    try {
      response = await this.urlchart.createChartImage({
        $,
        params,
      });
    } catch (err) {
      // The platform's axios throws with UrlChart's own message, but for an image
      // request the body arrives as a Buffer, so decode it and keep the status.
      const {
        status, data,
      } = err.response ?? {};
      if (!status) {
        throw err;
      }
      throw new Error(`UrlChart returned status ${status}: ${formatErrorDetail(data)}`);
    }

    if (response.status !== 200) {
      throw new Error(`UrlChart returned status ${response.status}: ${formatErrorDetail(response.data)}`);
    }

    const image = Buffer.from(response.data);
    const contentType = (response.headers?.["content-type"] ?? DEFAULT_CONTENT_TYPE)
      .split(";")[0]
      .trim();
    const bytes = image.length;
    const base64 = image.toString("base64");

    $.export("$summary", `Rendered a chart image (${contentType}, ${bytes} bytes)`);

    return {
      contentType,
      bytes,
      base64,
    };
  },
};
