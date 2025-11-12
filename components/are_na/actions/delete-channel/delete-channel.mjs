import app from "../../are_na.app.mjs";

export default {
  key: "are_na-delete-channel",
  name: "Delete Channel",
  description: "Delete a Channel with the specified slug. [See the documentation](https://dev.are.na/documentation/channels#Block45049)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    channelSlug: {
      propDefinition: [
        app,
        "channelSlug",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteChannel({
      $,
      slug: this.channelSlug,
    });
    $.export("$summary", `Successfully deleted channel with slug: '${this.channelSlug}'`);
    return response;
  },
};
