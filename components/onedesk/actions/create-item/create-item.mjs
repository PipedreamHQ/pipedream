import onedesk from "../../onedesk.app.mjs";

export default {
  key: "onedesk-create-item",
  name: "Create Item",
  description: "Creates a new item. [See the docs](https://www.onedesk.com/developers/#_create_work_item)",
  version: "0.0.1",
  type: "action",
  props: {
    onedesk,
    type: {
      propDefinition: [
        onedesk,
        "itemType",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the item",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the item",
      optional: true,
    },
    spaceId: {
      propDefinition: [
        onedesk,
        "spaceId",
      ],
    },
    priority: {
      propDefinition: [
        onedesk,
        "priority",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.onedesk.createItem({
      data: {
        type: this.type,
        name: this.name,
        description: this.description,
        spaceId: this.spaceId,
        priority: this.priority,
      },
      $,
    });

    $.export("$summary", `Successfully created item with ID ${data.id}.`);

    return data;
  },
};
