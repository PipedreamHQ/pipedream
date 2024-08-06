import airfocus from "../../airfocus.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "airfocus-create-item",
  name: "Create Item",
  description: "Creates a new item in airfocus. [See the documentation](https://developer.airfocus.com/endpoints.html)",
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
    statusId: {
      propDefinition: [
        airfocus,
        "statusId",
      ],
    },
    order: {
      propDefinition: [
        airfocus,
        "order",
      ],
    },
    name: {
      propDefinition: [
        airfocus,
        "name",
      ],
    },
    itemType: {
      propDefinition: [
        airfocus,
        "itemType",
      ],
    },
    fields: {
      propDefinition: [
        airfocus,
        "fields",
      ],
    },
    description: {
      propDefinition: [
        airfocus,
        "description",
      ],
    },
    color: {
      propDefinition: [
        airfocus,
        "color",
      ],
    },
    archived: {
      propDefinition: [
        airfocus,
        "archived",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.airfocus.createItem({
      workspaceId: this.workspaceId,
      statusId: this.statusId,
      order: this.order,
      name: this.name,
      itemType: this.itemType,
      fields: this.fields,
      description: this.description,
      color: this.color,
      archived: this.archived,
    });

    $.export("$summary", `Successfully created item with name ${this.name}`);
    return response;
  },
};
