import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-get-watch",
  name: "Get Watch",
  description: "Retrieve a single watch by its ID. [See the documentation](https://rendex.dev/docs/watch#endpoints).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rendex,
    watchId: {
      propDefinition: [
        rendex,
        "watchId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rendex.getWatch(this.watchId, {
      $,
    });

    const watch = response.data;
    $.export("$summary", `Retrieved watch ${this.watchId}`);
    return watch;
  },
};
