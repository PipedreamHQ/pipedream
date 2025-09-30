import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-create-item",
  name: "Create Item",
  description: "Create a new item in Microsoft Sharepoint. [See the documentation](https://learn.microsoft.com/en-us/graph/api/listitem-create?view=graph-rest-1.0&tabs=http)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
    },
    columnNames: {
      propDefinition: [
        sharepoint,
        "columnNames",
        (c) => ({
          siteId: c.siteId,
          listId: c.listId,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.columnNames?.length) {
      return props;
    }
    for (const column of this.columnNames) {
      props[`${column}_value`] = {
        type: "string",
        label: `${column} Value`,
      };
    }
    return props;
  },
  async run({ $ }) {
    const fields = {};
    if (this.columnNames?.length) {
      for (const column of this.columnNames) {
        fields[column] = this[`${column}_value`];
      }
    }

    const response = await this.sharepoint.createItem({
      siteId: this.siteId,
      listId: this.listId,
      data: {
        fields,
      },
    });

    if (response?.id) {
      $.export("$summary", `Successfully created item with ID ${response.id}.`);
    }

    return response;
  },
};
