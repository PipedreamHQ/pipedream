import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-find-files-with-metadata",
  name: "Find Files in List with Metadata",
  description:
    "Search and filter items in a SharePoint list based on metadata and custom columns. [See docs here](https://learn.microsoft.com/en-us/graph/api/listitem-list)",
  version: "0.0.1",
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
      description: "Select the SharePoint site.",
    },
    listId: {
      propDefinition: [
        sharepoint,
        "listId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
      description: "Select the list or document library to search within.",
    },
    returnFields: {
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
      label: "Fields to Return",
      description:
        "Select which custom fields to return. If left empty, all custom fields are returned.",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter Query",
      description:
        "OData filter query. To filter by a custom column, use the format `fields/InternalName eq 'Value'`. The field picker for 'Fields to Return' shows the `InternalName` in parentheses.",
      optional: true,
    },
    orderby: {
      type: "string",
      label: "Order By",
      description:
        "OData order by query (e.g., `lastModifiedDateTime desc`). To sort by a custom field, use `fields/InternalName asc`.",
      optional: true,
    },
    select: {
      type: "string[]",
      label: "Top-level Properties",
      description:
        "Select which top-level item properties to return. If not specified, a default set is returned. `id` and `webUrl` are always returned.",
      optional: true,
      options: [
        "id",
        "name",
        "createdDateTime",
        "lastModifiedDateTime",
        "webUrl",
        "size",
      ],
    },
  },
  async run({ $ }) {
    const {
      siteId, listId, returnFields, filter, orderby, select,
    } = this;

    const params = {
      $filter: filter,
      $orderby: orderby,
    };

    let expandValue = "fields";
    if (returnFields?.length > 0) {
      expandValue = `fields($select=${returnFields.join(",")})`;
    }

    if (select?.length > 0) {
      const selectSet = new Set(select);
      selectSet.add("id");
      selectSet.add("webUrl");
      params.$select = Array.from(selectSet).join(",");
    }

    params.$expand = expandValue;

    const results = [];
    const iterator = this.sharepoint.paginate({
      fn: this.sharepoint.listItems,
      args: {
        siteId,
        listId,
        params,
      },
    });

    for await (const item of iterator) {
      results.push(item);
    }

    $.export(
      "$summary",
      `Successfully found ${results.length} item${
        results.length === 1
          ? ""
          : "s"
      }.`,
    );
    return results;
  },
};
