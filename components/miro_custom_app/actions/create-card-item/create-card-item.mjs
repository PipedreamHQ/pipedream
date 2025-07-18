import common from "../common/base.mjs";

export default {
  key: "miro_custom_app-create-card-item",
  name: "Create Card Item",
  description: "Creates a card item on a Miro board. [See the documentation](https://developers.miro.com/reference/create-card-item).",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    title: {
      propDefinition: [
        common.props.app,
        "cardTitle",
      ],
    },
    assigneeId: {
      propDefinition: [
        common.props.app,
        "userId",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
      label: "Assignee ID",
      description: "The ID of the user to assign the card to",
      optional: true,
    },
    description: {
      propDefinition: [
        common.props.app,
        "cardDescription",
      ],
    },
    dueDate: {
      propDefinition: [
        common.props.app,
        "dueDate",
      ],
    },
    cardTheme: {
      propDefinition: [
        common.props.app,
        "cardTheme",
      ],
    },
    x: {
      propDefinition: [
        common.props.app,
        "x",
      ],
      optional: true,
    },
    y: {
      propDefinition: [
        common.props.app,
        "y",
      ],
      optional: true,
    },
    height: {
      propDefinition: [
        common.props.app,
        "height",
      ],
    },
    rotation: {
      propDefinition: [
        common.props.app,
        "rotation",
      ],
    },
    width: {
      propDefinition: [
        common.props.app,
        "width",
      ],
    },
    parent: {
      propDefinition: [
        common.props.app,
        "itemId",
        (c) => ({
          boardId: c.boardId,
          type: "frame",
        }),
      ],
      label: "Parent ID",
      description: "The ID of the parent frame for the item",
      optional: true,
    },
  },
  async run({ $: step }) {
    const response = await this.app.createCardItem({
      step,
      boardId: this.boardId,
      data: {
        data: {
          title: this.title,
          assigneeId: this.assigneeId,
          description: this.description,
          dueDate: this.dueDate,
        },
        style: {
          cardTheme: this.cardTheme,
        },
        position: {
          x: this.x,
          y: this.y,
        },
        geometry: {
          height: this.height,
          rotation: this.rotation,
          width: this.width,
        },
        parent: {
          id: this.parent,
        },
      },
    });
    step.export("$summary", `Successfully created card item with ID \`${response.id}\``);
    return response;
  },
};
