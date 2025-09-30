import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";

const { app } = common.props;

export default {
  name: "Update Sticky Note",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "miro_custom_app-update-sticky-note",
  description: "Updates content of an existing sticky note on a Miro board. [See the docs](https://developers.miro.com/reference/update-sticky-note-item).",
  type: "action",
  props: {
    ...common.props,
    itemId: {
      propDefinition: [
        app,
        "itemId",
        ({ boardId }) => ({
          boardId,
          type: constants.ITEM_TYPE.STICKY_NOTE,
        }),
      ],
    },
    content: {
      propDefinition: [
        app,
        "content",
      ],
      description: "The actual text (content) that appears in the sticky note item.",
    },
    shape: {
      propDefinition: [
        app,
        "shape",
      ],
      description: "Defines the geometric shape of the sticky note and aspect ratio for its dimensions.",
      options: constants.STICKY_NOTE_SHAPES_OPTIONS,
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

    const response = await this.app.updateStickyNote({
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

    step.export("$summary", `Successfully updated sticky note with ID \`${response.id}\``);

    return response;
  },
};
