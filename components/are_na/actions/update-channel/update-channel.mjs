import are_na from "../../are_na.app.mjs";

export default {
  key: "are_na-update-channel",
  name: "Update Channel",
  description: "Update the title, visibility, description or metadata of an existing channel. Only the fields you provide are changed. Use **List Channel Slug Options** to find the slug; to create a new channel use **Create Channel**. Returns the updated channel object. Example: Channel Slug `brutalist-architecture` with Channel Status `closed` makes that channel visible to everyone while limiting who can add to it. [See the documentation](https://www.are.na/developers/explore/channel/put-channel)",
  version: "0.1.0",
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
    channelTitle: {
      propDefinition: [
        are_na,
        "channelTitle",
      ],
      optional: true,
    },
    channelStatus: {
      propDefinition: [
        are_na,
        "channelStatus",
      ],
      optional: true,
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
    const response = await this.are_na.updateChannel({
      $,
      slug: this.channelSlug,
      data: {
        title: this.channelTitle,
        visibility: this.channelStatus,
        description: this.channelDescription,
        metadata: this.channelMetadata,
      },
    });
    $.export("$summary", `Successfully updated channel with slug: '${this.channelSlug}'`);
    return response;
  },
};
