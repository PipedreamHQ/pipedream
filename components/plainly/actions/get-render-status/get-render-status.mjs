import plainly from "../../plainly.app.mjs";

export default {
  key: "plainly-get-render-status",
  name: "Get Render Status",
  description: "Retrieves the current status of a render job in Plainly. [See the documentation](https://www.plainlyvideos.com/documentation/api-reference)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    plainly,
    renderId: {
      propDefinition: [
        plainly,
        "renderId",
      ],
    },
  },
  async run({ $ }) {
    const render = await this.plainly.getRender({
      $,
      renderId: this.renderId,
    });
    $.export("$summary", `Retrieved status ${render.state } for render ${this.renderId}`);
    return render;
  },
};
