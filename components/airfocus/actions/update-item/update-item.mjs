import airfocus from "../../airfocus.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "airfocus-update-item",
  name: "Update Item",
  description: "Updates an existing item in airfocus. [See the documentation](https://developer.airfocus.com/endpoints.html)",
  version: "0.1.0",
  type: "action",
  props: {
    airfocus,
    workspaceId: {
      propDefinition: [
        airfocus,
        "workspaceId",
      ],
    },
    itemId: {
      propDefinition: [
        airfocus,
        "itemId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
    name: {
      propDefinition: [
        airfocus,
        "name",
      ],
      optional: true,
    },
    statusId: {
      propDefinition: [
        airfocus,
        "statusId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        airfocus,
        "description",
      ],
      optional: true,
    },
    fields: {
      propDefinition: [
        airfocus,
        "fields",
      ],
      optional: true,
    },
    color: {
      propDefinition: [
        airfocus,
        "color",
      ],
      optional: true,
    },
    archived: {
      propDefinition: [
        airfocus,
        "archived",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      airfocus,
      fields,
      ...props
    } = this;
    const item = await airfocus.getItem({
      workspaceId: this.workspaceId,
      itemId: this.itemId,
    });

    const data = {
      ...item,
      ...props,
    };

    const parsedFields = parseObject(fields);
    if (parsedFields) {
      data.fields = parsedFields;
    }

    const response = await this.airfocus.updateItem({
      $,
      workspaceId: this.workspaceId,
      itemId: this.itemId,
      data,
    });
    $.export("$summary", `Successfully updated item with ID ${this.itemId}`);
    return response;
  },
};
