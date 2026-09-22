import linkly from "../../linkly.app.mjs";

export default {
  key: "linkly-list-links",
  name: "List Links",
  description: "List all short links in your workspace via `GET /api/v1/workspace/{workspace_id}/list_links`, with click counts and metadata. [See the documentation](https://app.linklyhq.com/swaggerui#/Links/listLinks).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    linkly,
    search: {
      type: "string",
      label: "Search",
      description: "Optional search query to filter links by URL or name",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of links to return. Defaults to 100.",
      optional: true,
      default: 100,
    },
  },
  async run({ $ }) {
    const links = [];
    const iterator = this.linkly.paginate({
      resourceFn: this.linkly.listLinks,
      resourceType: "links",
      params: {
        search: this.search,
      },
      $,
    });
    for await (const link of iterator) {
      if (links.length >= this.maxResults) break;
      links.push(link);
    }
    $.export("$summary", `Successfully fetched ${links.length} link${links.length === 1
      ? ""
      : "s"}.`);
    return links;
  },
};
