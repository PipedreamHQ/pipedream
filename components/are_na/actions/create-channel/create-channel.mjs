import app from "../../are_na.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "are_na-create-channel",
  name: "Create Channel",
  description: "Create a new channel (a collection of blocks) owned by the authenticated user. Use this when the user wants a new place to collect content; to change an existing channel use **Update Channel**. Returns the created channel object, including its `id` and `slug`. The channel title does not have to be unique. Example: Channel Title `Brutalist Architecture` with Channel Status `private` returns `{ \"id\": 12345, \"slug\": \"brutalist-architecture\", \"title\": \"Brutalist Architecture\", \"visibility\": \"private\" }`. [See the documentation](https://www.are.na/developers/explore/channel/post-channel)",
  version: "0.1.0",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
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
    channelDescription: {
      propDefinition: [
        app,
        "channelDescription",
      ],
    },
    channelMetadata: {
      propDefinition: [
        app,
        "channelMetadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createChannel({
      $,
      data: {
        title: this.channelTitle,
        visibility: this.channelStatus,
        description: this.channelDescription,
        metadata: utils.parseJsonObject(this.channelMetadata, "Metadata"),
      },
    });
    $.export("$summary", `Successfully created channel '${this.channelTitle}' with slug '${response.slug}'`);
    return response;
  },
};
