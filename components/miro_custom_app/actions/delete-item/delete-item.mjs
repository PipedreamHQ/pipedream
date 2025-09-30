import common from "../common/base.mjs";

const { app } = common.props;

export default {
  name: "Delete Item",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "miro_custom_app-delete-item",
  description: "Deletes an item from a Miro board. [See the docs](https://developers.miro.com/reference/delete-item).",
  type: "action",
  props: {
    ...common.props,
    itemId: {
      propDefinition: [
        app,
        "itemId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
    },
  },
  async run({ $: step }) {
    const {
      boardId,
      itemId,
    } = this;

    await this.app.deleteItem({
      step,
      boardId,
      itemId,
    });

    step.export("$summary", "Successfully deleted item");

    return itemId;
  },
};
