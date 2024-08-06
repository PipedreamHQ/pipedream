import airfocus from "../../airfocus.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "airfocus-update-item",
  name: "Update Item",
  description: "Updates an existing item in airfocus. [See the documentation](https://developer.airfocus.com/endpoints.html)",
  version: "0.0.{{ts}}",
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
      ],
    },
    name: {
      propDefinition: [
        airfocus,
        "name",
      ],
      optional: true,
    },
    itemType: {
      propDefinition: [
        airfocus,
        "itemType",
      ],
      optional: true,
    },
    statusId: {
      propDefinition: [
        airfocus,
        "statusId",
      ],
      optional: true,
    },
    order: {
      propDefinition: [
        airfocus,
        "order",
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
    description: {
      propDefinition: [
        airfocus,
        "description",
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
      workspaceId, itemId, ...otherFields
    } = this;
    const response = await this.airfocus.updateItem({
      workspaceId,
      itemId,
      ...otherFields,
    });
    $.export("$summary", `Successfully updated item with ID ${itemId}`);
    return response;
  },
};
