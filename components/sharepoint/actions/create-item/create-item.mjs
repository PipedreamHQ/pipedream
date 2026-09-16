import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-create-item",
  name: "Create Item",
  description: "Create a new item in a SharePoint list. Provide the column names and values for the new item as a `fields` object. [See the documentation](https://learn.microsoft.com/en-us/graph/api/listitem-create?view=graph-rest-1.0&tabs=http)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
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
    fields: {
      propDefinition: [
        sharepoint,
        "listItemFields",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sharepoint.createItem({
      siteId: this.siteId,
      listId: this.listId,
      data: {
        fields: this.fields,
      },
    });

    if (response?.id) {
      $.export("$summary", `Successfully created item with ID ${response.id}.`);
    }

    return response;
  },
};
