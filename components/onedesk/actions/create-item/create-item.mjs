import app from "../../onedesk.app.mjs";

export default {
  key: "onedesk-create-item",
  name: "Create Item",
  description: "Creates a new item. [See the documentation](https://www.onedesk.com/dev/).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "itemName",
      ],
    },
    type: {
      propDefinition: [
        app,
        "itemType",
      ],
    },
    description: {
      propDefinition: [
        app,
        "itemDescription",
      ],
    },
    projectExternalId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    priority: {
      propDefinition: [
        app,
        "priority",
      ],
    },
  },
  methods: {
    createItem(args = {}) {
      return this.app.post({
        path: "/items/",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createItem,
      name,
      type,
      description,
      projectExternalId,
      priority,
    } = this;

    const response = await createItem({
      $,
      data: {
        name,
        type,
        description,
        projectExternalId,
        priority,
      },
    });

    $.export("$summary", `Successfully created item with ID \`${response.data}\`.`);

    return response;
  },
};
