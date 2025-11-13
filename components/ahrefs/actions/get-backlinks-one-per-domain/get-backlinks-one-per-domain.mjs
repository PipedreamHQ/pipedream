import ahrefs from "../../ahrefs.app.mjs";

export default {
  name: "Get Backlinks One Per Domain",
  key: "ahrefs-get-backlinks-one-per-domain",
  description: "Get one backlink with the highest `ahrefs_rank` per referring domain for a target URL or domain (with details for the referring pages including anchor and page title). [See the documentation](https://docs.ahrefs.com/docs/api/site-explorer/operations/list-all-backlinks)",
  version: "0.0.6",
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
        aggregation: "1_per_domain",
        target: this.target,
        select: this.select.join(","),
        mode: this.mode,
        limit: this.limit,
      },
    });
    $.export("$summary", "Successfully retrieved backlinks data");
    return response;
  },
};
