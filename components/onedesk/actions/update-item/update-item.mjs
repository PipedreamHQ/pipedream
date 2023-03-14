import onedesk from "../../onedesk.app.mjs";
import pickBy from "lodash.pickby";

export default {
  key: "onedesk-update-item",
  name: "Update Item",
  description: "Updates an existing item. [See the docs](https://www.onedesk.com/developers/#_update_work_item)",
  version: "0.0.1",
  type: "action",
  props: {
    onedesk,
    itemId: {
      propDefinition: [
        onedesk,
        "itemId",
      ],
      description: "",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the item",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the item",
      optional: true,
    },
    priority: {
      propDefinition: [
        onedesk,
        "priority",
      ],
      optional: true,
    },
    progress: {
      type: "integer",
      label: "Progress",
      description: "Progress of the item between 1 and 100",
      max: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.onedesk.updateItem({
      data: pickBy({
        itemId: this.itemId,
        name: this.name,
        spaceId: this.spaceId,
        priority: this.priority,
        progress: this.progress,
      }),
      $,
    });

    $.export("$summary", `Successfully updated item with ID ${data.id}.`);

    return data;
  },
};
