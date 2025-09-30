import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";

const { app } = common.props;

export default {
  name: "Create Sticky Note",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "miro_custom_app-create-sticky-note",
  description: "Creates a sticky note on a Miro board. [See the docs](https://developers.miro.com/reference/create-sticky-note-item).",
  type: "action",
  props: {
    ...common.props,
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
      content,
      shape,
      x,
      y,
    } = this;

    const response = await this.app.createStickyNote({
      step,
      boardId,
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

    step.export("$summary", `Successfully created a sticky note with ID \`${response.id}\``);

    return response;
  },
};
