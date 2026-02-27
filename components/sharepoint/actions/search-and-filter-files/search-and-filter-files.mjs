import sharepoint from "../../sharepoint.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sharepoint-search-and-filter-files",
  name: "Search and Filter Files",
  description:
    "Search and filter SharePoint files based on metadata and custom columns. This action allows you to query files using SharePoint's custom properties, managed metadata, and other column values. [See the documentation](https://learn.microsoft.com/en-us/graph/api/listitem-list)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sharepoint,
    siteId: {
      propDefinition: [
        sharepoint,
        "siteId",
      ],
    },
    listId: {
      propDefinition: [
        sharepoint,
        "listId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
      label: "List / Document Library",
      description: "Select the document library or list to search in",
    },
    filter: {
      type: "string",
      label: "Filter",
      description:
        "Filter items using OData syntax. To filter by custom columns, use `fields/ColumnInternalName`. Example: `fields/Title eq 'My File'` or `fields/Status eq 'Approved'`. [See OData filter documentation](https://learn.microsoft.com/en-us/graph/query-parameters#filter-parameter)",
      optional: true,
    },
    select: {
      propDefinition: [
        sharepoint,
        "columnNames",
        (c) => ({
          siteId: c.siteId,
          listId: c.listId,
          mapper: ({
            name, displayName,
          }) => ({
            label: displayName,
            value: name,
          }),
        }),
      ],
      label: "Select Fields",
      description:
        "Select the specific metadata fields to return in the response. If none are selected, all fields will be returned.",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description:
        "Specify the sort order of the results using OData syntax. Example: `fields/Created desc` or `fields/Title asc`.",
      optional: true,
    },
    expandFields: {
      type: "boolean",
      label: "Expand Fields?",
      description:
        "Set to `true` to retrieve custom metadata and column values. Defaults to `true`.",
      optional: true,
      default: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return. Defaults to 100.",
      optional: true,
      default: 100,
      min: 1,
    },
  },
  async run({ $ }) {
    const {
      siteId,
      listId,
      filter,
      select,
      orderBy,
      expandFields,
      maxResults,
    } = this;

    const expand = expandFields
      ? "fields"
      : undefined;

    // Construct select parameter
    // If fields are selected, we need to select them within the expanded fields
    // Graph API supports $expand=fields($select=Title,Color)
    let expandParam = expand;
    if (expandFields && select?.length > 0) {
      expandParam = `fields($select=${select.join(",")})`;
    }

    const params = utils.cleanObject({
      $filter: filter,
      $expand: expandParam,
      $orderby: orderBy,
      $top: Math.max(1, maxResults),
    });

    const items = [];
    const iterator = this.sharepoint.paginate({
      fn: this.sharepoint.listItems,
      args: {
        $,
        siteId,
        listId,
        params,
      },
    });

    for await (const item of iterator) {
      items.push({
        id: item.id,
        name:
          item.fields?.FileLeafRef ||
          item.fields?.Title ||
          item.name ||
          item.displayName,
        fileType: item.fields?.File_x0020_Type,
        createdDateTime: item.createdDateTime,
        lastModifiedDateTime: item.lastModifiedDateTime,
        webUrl: item.webUrl,
        fields: item.fields,
      });

      if (items.length >= maxResults) {
        break;
      }
    }

    $.export(
      "$summary",
      `Found ${items.length} matching item${items.length === 1
        ? ""
        : "s"}`,
    );
    return items;
  },
};
