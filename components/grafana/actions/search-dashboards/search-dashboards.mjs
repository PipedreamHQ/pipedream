// vandelay-test-dr
import grafana from "../../grafana.app.mjs";

export default {
  key: "grafana-search-dashboards",
  name: "Search Dashboards",
  description:
    "Search for dashboards by title, tag, or folder."
    + " Returns dashboard UIDs, titles, URLs, tags, and folder"
    + " info."
    + " Use the UID with **Get Dashboard** to retrieve the full"
    + " dashboard model."
    + " Use **List Folders** to discover folder UIDs for"
    + " filtering.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    grafana,
    query: {
      type: "string",
      label: "Query",
      description:
        "Search dashboards by title. Partial matches supported.",
      optional: true,
    },
    tag: {
      type: "string[]",
      label: "Tags",
      description:
        "Filter dashboards by tags. Returns dashboards matching"
        + " any of the specified tags.",
      optional: true,
    },
    folderUids: {
      type: "string[]",
      label: "Folder UIDs",
      description:
        "Filter by folder UIDs. Use **List Folders** to discover"
        + " available folders.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description:
        "Filter by type. `dash-db` for dashboards,"
        + " `dash-folder` for folders.",
      optional: true,
      options: [
        "dash-db",
        "dash-folder",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results. Default: 100.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.query) params.query = this.query;
    if (this.tag?.length) params.tag = this.tag;
    if (this.folderUids?.length) {
      params.folderUIDs = this.folderUids;
    }
    if (this.type) params.type = this.type;
    if (this.limit) params.limit = this.limit;

    const results = await this.grafana.searchDashboards($, params);

    const count = Array.isArray(results)
      ? results.length
      : 0;

    $.export(
      "$summary",
      `Found ${count} dashboard${count === 1
        ? ""
        : "s"}`,
    );

    return results;
  },
};
