import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-delete-watch",
  name: "Delete Watch",
  description: "Delete a watch and its run history. [See the documentation](https://rendex.dev/docs/watch#endpoints).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    await this.rendex.deleteWatch(this.watchId, {
      $,
    });

    $.export("$summary", `Deleted watch ${this.watchId}`);
    return {
      success: true,
      watchId: this.watchId,
    };
  },
};
