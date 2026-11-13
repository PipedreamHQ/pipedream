import are_na from "../../are_na.app.mjs";

export default {
  key: "are_na-create-channel",
  name: "Create Channel",
  description: "Create a new channel (a collection of blocks) owned by the authenticated user. Use this when the user wants a new place to collect content; to change an existing channel use **Update Channel**. Returns the created channel object, including its `id` and `slug`. The channel title does not have to be unique. Example: Channel Title `Brutalist Architecture` with Channel Status `private` returns `{ \"id\": 12345, \"slug\": \"brutalist-architecture\", \"title\": \"Brutalist Architecture\", \"visibility\": \"private\" }`. [See the documentation](https://www.are.na/developers/explore/channel/post-channel)",
  version: "1.0.0",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    are_na,
    channelTitle: {
      propDefinition: [
        are_na,
        "channelTitle",
      ],
    },
    channelStatus: {
      propDefinition: [
        are_na,
        "channelStatus",
      ],
    },
    channelDescription: {
      propDefinition: [
        are_na,
        "channelDescription",
      ],
    },
    channelMetadata: {
      propDefinition: [
        are_na,
        "channelMetadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.are_na.createChannel({
      $,
      data: {
        title: this.channelTitle,
        visibility: this.channelStatus,
        description: this.channelDescription,
        metadata: this.channelMetadata,
      },
    });
    $.export("$summary", `Successfully created channel '${this.channelTitle}' with slug '${response.slug}'`);
    return response;
  },
};
