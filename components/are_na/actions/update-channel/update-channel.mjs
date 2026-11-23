import app from "../../are_na.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "are_na-update-channel",
  name: "Update Channel",
  description: "Update the title, visibility, description or metadata of an existing channel. Only the fields you provide are changed, and Metadata is merged with the existing metadata. Use **List Channel Slug Options** to find the slug (lists your own channels; if you already know the slug, pass it directly); to create a new channel use **Create Channel**. Returns the updated channel object. Example: Channel Slug `brutalist-architecture` with Channel Status `closed` makes that channel visible to everyone while limiting who can add to it. [See the documentation](https://www.are.na/developers/explore/channel/put-channel)",
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
      optional: true,
    },
    channelStatus: {
      propDefinition: [
        app,
        "channelStatus",
      ],
      optional: true,
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
      description: "Metadata to merge into the channel, e.g. `{\"status\": \"reviewed\", \"priority\": 2}`. New keys are added, existing keys are updated, and a key set to `null` is removed. Keys are alphanumeric/underscore, max 40 characters. Values are strings, numbers, booleans or `null`. Max 50 keys, 32KB total",
    },
  },
  async run({ $ }) {
    const response = await this.app.updateChannel({
      $,
      slug: this.channelSlug,
      data: {
        title: this.channelTitle,
        visibility: this.channelStatus,
        description: this.channelDescription,
        metadata: utils.parseJsonObject(this.channelMetadata, "Metadata"),
      },
    });
    $.export("$summary", `Successfully updated channel with slug: '${this.channelSlug}'`);
    return response;
  },
};
