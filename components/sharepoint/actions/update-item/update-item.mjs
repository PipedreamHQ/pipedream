import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-update-item",
  name: "Update Item",
  description: "Update an existing item in a SharePoint list. Provide only the fields you want to change — omitted fields are left unchanged. [See the documentation](https://learn.microsoft.com/en-us/graph/api/listitem-update?view=graph-rest-1.0&tabs=http)",
  version: "0.0.18",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    sharepoint,
    siteId: {
      propDefinition: [
        sharepoint,
        "siteIdInput",
      ],
    },
    listId: {
      propDefinition: [
        sharepoint,
        "listIdInput",
      ],
    },
    itemId: {
      propDefinition: [
        sharepoint,
        "itemIdInput",
      ],
    },
    fields: {
      propDefinition: [
        sharepoint,
        "listItemFields",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sharepoint.updateItem({
      siteId: this.siteId,
      listId: this.listId,
      itemId: this.itemId,
      data: this.fields,
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully updated item with ID ${response.id}.`);
    }

    return response;
  },
};
