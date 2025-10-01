import app from "../../miro_custom_app.app.mjs";

export default {
  name: "Create Board",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "miro_custom_app-create-board",
  description: "Creates a Miro board. [See the docs](https://developers.miro.com/reference/create-board).",
  type: "action",
  props: {
    app,
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
      name,
      description,
    } = this;

    const response = await this.app.createBoard({
      step,
      data: {
        name,
        description,
      },
    });

    step.export("$summary", `Successfully created a board with ID \`${response.id}\``);

    return response;
  },
};
