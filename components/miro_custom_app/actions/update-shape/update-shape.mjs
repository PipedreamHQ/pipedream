import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";

const { app } = common.props;

export default {
  name: "Update Shape",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "miro_custom_app-update-shape",
  description: "Updates content of an existing shape on a Miro board. [See the docs](https://developers.miro.com/reference/update-shape-item).",
  type: "action",
  props: {
    ...common.props,
    itemId: {
      propDefinition: [
        app,
        "itemId",
        ({ boardId }) => ({
          boardId,
          type: constants.ITEM_TYPE.SHAPE,
        }),
      ],
    },
    content: {
      propDefinition: [
        app,
        "content",
      ],
      optional: true,
    },
    shape: {
      propDefinition: [
        app,
        "shape",
      ],
      optional: true,
    },
    x: {
      propDefinition: [
        app,
        "x",
      ],
    },
    y: {
      propDefinition: [
        app,
        "y",
      ],
    },
  },
  async run({ $: step }) {
    const {
      boardId,
      itemId,
      content,
      shape,
      x,
      y,
    } = this;

    const response = await this.app.updateShape({
      step,
      boardId,
      itemId,
      data: {
        data: {
          content,
          shape,
        },
        position: {
          origin: "center",
          x,
          y,
        },
      },
    });

    step.export("$summary", `Successfully updated shape with ID \`${response.id}\``);

    return response;
  },
};
