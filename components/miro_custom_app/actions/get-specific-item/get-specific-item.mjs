import common from "../common/base.mjs";

const { app } = common.props;

export default {
  name: "Get Specific Item",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "miro_custom_app-get-specific-item",
  description: "Returns a specific item on a Miro board. [See the docs](https://developers.miro.com/reference/get-specific-item).",
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

    const response = await this.app.getSpecificItem({
      step,
      boardId,
      itemId,
    });

    step.export("$summary", `Successfully got item with ID \`${response.id}\``);

    return response;
  },
};
