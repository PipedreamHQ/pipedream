import utils from "../../common/utils.mjs";
import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-update-item",
  name: "Update Item",
  description: "Updates an existing item in Microsoft Sharepoint. [See the documentation](https://learn.microsoft.com/en-us/graph/api/listitem-update?view=graph-rest-1.0&tabs=http)",
  version: "0.0.9",
  annotations: {
    destructiveHint: true,
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
      reloadProps: true,
    },
    itemId: {
      propDefinition: [
        sharepoint,
        "itemId",
        (c) => ({
          siteId: c.siteId,
          listId: c.listId,
        }),
      ],
    },
  },
  async additionalProps() {
    const props = {};
    const { value: columns } = await this.sharepoint.listColumns({
      siteId: this.siteId,
      listId: this.listId,
    });
    const editableColumns = columns?.filter(({ readOnly }) => !readOnly) || [];
    for (const column of editableColumns) {
      props[column.name] = {
        type: "string",
        label: column.name,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      sharepoint,
      siteId,
      listId,
      itemId,
      ...otherProps
    } = this;

    const data = utils.cleanObject(otherProps);

    const response = await sharepoint.updateItem({
      siteId,
      listId,
      itemId,
      data,
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully updated item with ID ${response.id}.`);
    }

    return response;
  },
};
