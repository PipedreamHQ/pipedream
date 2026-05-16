import renderio from "../../renderio.app.mjs";
import { normalizeList } from "../../common/utils.mjs";

export default {
  key: "renderio-list-presets",
  name: "List Presets",
  description: "Retrieve available RenderIO presets. [See the documentation](https://renderio.dev/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    renderio,
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of presets to return.",
      default: 50,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of presets to skip for pagination.",
      default: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.renderio.listPresets({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
      },
    });
    const presets = normalizeList(response, "presets");
    $.export("$summary", `Successfully retrieved ${presets.length} preset${presets.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
