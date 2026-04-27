import arcgisOnline from "../../arcgis_online.app.mjs";

export default {
  key: "arcgis_online-list-feature-services",
  name: "List Feature Services",
  description:
    "List Feature Services accessible to the authenticated user. By default only returns services within the user's organization. [See the documentation](https://developers.arcgis.com/rest/services-reference/enterprise/feature-service/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    arcgisOnline,
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "Optional text to filter Feature Services by name or keyword",
      optional: true,
    },
    includePublic: {
      type: "boolean",
      label: "Include Public",
      description:
        "When `false` (default), only Feature Services within your organization are returned. Set to `true` to also include publicly shared Feature Services",
      default: false,
      optional: true,
    },
    maxRecords: {
      type: "integer",
      label: "Max Records",
      description: "Maximum number of Feature Services to return",
      default: 500,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      items, truncated,
    } = await this.arcgisOnline.listAllFeatureServices({
      $,
      query: this.searchQuery,
      includePublic: this.includePublic,
      maxRecords: this.maxRecords,
    });

    $.export(
      "$summary",
      truncated
        ? `Returned ${items.length} feature service(s) (results truncated — more may exist)`
        : `Found ${items.length} feature service(s)`,
    );
    return items;
  },
};
