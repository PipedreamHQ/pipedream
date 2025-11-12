import app from "../../are_na.app.mjs";

export default {
  key: "are_na-update-channel",
  name: "Update Channel",
  description: "Update a Channel with the specified slug. [See the documentation](https://dev.are.na/documentation/channels#Block45048)",
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
    channelTitle: {
      propDefinition: [
        app,
        "channelTitle",
      ],
    },
    channelStatus: {
      propDefinition: [
        app,
        "channelStatus",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.updateChannel({
      $,
      slug: this.channelSlug,
      params: {
        title: this.channelTitle,
        status: this.channelStatus,
      },
    });
    $.export("$summary", `Successfully updated channel with slug: '${this.channelSlug}'`);
    return response;
  },
};
