import common from "../common/base.mjs";

const { app } = common.props;

export default {
  name: "Update Board",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "miro_custom_app-update-board",
  description: "Updates a Miro board. [See the docs](https://developers.miro.com/reference/update-board).",
  type: "action",
  props: {
    ...common.props,
    name: {
      propDefinition: [
        app,
        "name",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
      optional: true,
    },
  },
  async run({ $: step }) {
    const {
      boardId,
      name,
      description,
    } = this;

    const response = await this.app.updateBoard({
      step,
      boardId,
      data: {
        name,
        description,
      },
    });

    step.export("$summary", `Successfully updated board with ID \`${response.id}\``);

    return response;
  },
};
