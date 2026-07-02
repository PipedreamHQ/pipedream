import renderio from "../../renderio.app.mjs";
import { normalizeList } from "../../common/utils.mjs";

export default {
  key: "renderio-list-stored-files",
  name: "List Stored Files",
  description: "Retrieve stored files for the account. [See the documentation](https://renderio.dev/docs/api-reference/files/list-files)",
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
      description: "Maximum number of files to return.",
      default: 50,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of files to skip for pagination.",
      default: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.renderio.listFiles({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
      },
    });
    const files = normalizeList(response, "files");
    $.export("$summary", `Successfully retrieved ${files.length} file${files.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
