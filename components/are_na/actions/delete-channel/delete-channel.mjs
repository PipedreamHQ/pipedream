import are_na from "../../are_na.app.mjs";

export default {
  key: "are_na-delete-channel",
  name: "Delete Channel",
  description: "Permanently delete a channel and its connections. This cannot be undone, so confirm with the user first and only use it when they asked to delete the channel. Use **List Channel Slug Options** to find the slug (Premium only; if you already know the slug, pass it directly); to change a channel instead, use **Update Channel**. Returns the API response for the deleted channel. Example: Channel Slug `brutalist-architecture` deletes that channel. [See the documentation](https://www.are.na/developers/explore/channel/delete-channel)",
  version: "1.0.0",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    are_na,
    channelSlug: {
      propDefinition: [
        are_na,
        "channelSlug",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.are_na.deleteChannel({
      $,
      slug: this.channelSlug,
    });
    $.export("$summary", `Successfully deleted channel with slug: '${this.channelSlug}'`);
    return response;
  },
};
