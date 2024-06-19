import app from "../../onedesk.app.mjs";

export default {
  key: "onedesk-update-item",
  name: "Update Item",
  description: "Updates an existing item. [See the documentation](https://www.onedesk.com/dev/).",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    itemType: {
      optional: false,
      propDefinition: [
        app,
        "itemType",
      ],
    },
    itemId: {
      propDefinition: [
        app,
        "itemId",
        ({ itemType }) => ({
          itemType,
        }),
      ],
    },
    name: {
      optional: true,
      propDefinition: [
        app,
        "itemName",
      ],
    },
    description: {
      propDefinition: [
        app,
        "itemDescription",
      ],
    },
    priority: {
      propDefinition: [
        app,
        "priority",
      ],
    },
    percentComplete: {
      type: "integer",
      label: "Progress",
      description: "Progress of the item between `1` and `100`",
      max: 100,
      optional: true,
    },
  },
  methods: {
    updateItem({
      itemId, ...args
    } = {}) {
      return this.app.post({
        path: `/items/id/${itemId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateItem,
      itemId,
      name,
      description,
      priority,
      percentComplete,
    } = this;

    const response = await updateItem({
      $,
      itemId,
      data: {
        name,
        description,
        priority,
        percentComplete,
      },
    });

    $.export("$summary", `Successfully updated item with code \`${response}\`.`);

    return response;
  },
};
