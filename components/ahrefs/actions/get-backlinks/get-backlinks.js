const ahrefs = require("../../ahrefs.app.js");

export default {
  name: "Get Backlinks",
  key: "ahrefs-get-backlinks",
  description: "Get the backlinks for a domain or URL with details for the referring pages (e.g., anchor and page title). [See the documentation](https://docs.ahrefs.com/docs/api/site-explorer/operations/list-all-backlinks)",
  version: "0.0.10",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ahrefs,
    target: {
      propDefinition: [
        ahrefs,
        "target",
      ],
    },
    select: {
      propDefinition: [
        ahrefs,
        "select",
      ],
    },
    mode: {
      propDefinition: [
        ahrefs,
        "mode",
      ],
    },
    limit: {
      propDefinition: [
        ahrefs,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ahrefs.getBacklinks({
      $,
      params: {
        target: this.target,
        select: this.select,
        mode: this.mode,
        limit: this.limit,
      },
    });
    $.export("$summary", "Successfully retrieved backlinks data");
    return response;
  },
};
