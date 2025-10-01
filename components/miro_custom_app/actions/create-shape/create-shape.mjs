import common from "../common/base.mjs";

const { app } = common.props;

export default {
  name: "Create Shape",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "miro_custom_app-create-shape",
  description: "Creates a shape on a Miro board. [See the docs](https://developers.miro.com/reference/create-shape-item).",
  type: "action",
  props: {
    ...common.props,
    content: {
      propDefinition: [
        app,
        "content",
      ],
    },
    shape: {
      propDefinition: [
        app,
        "shape",
      ],
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
      shape,
      content,
      x,
      y,
    } = this;

    const response = await this.app.createShape({
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

    step.export("$summary", `Successfully created a shape with ID \`${response.id}\``);

    return response;
  },
};
