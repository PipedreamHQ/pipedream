import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-channel",
  name: "Get Channel",
  description: "Retrieves a single channel by its ID. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-channel/get-conversations-v3-conversations-channels-channelId)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hubspot,
    channelId: {
      propDefinition: [
        hubspot,
        "channelId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.getChannel({
      $,
      channelId: this.channelId,
    });
    $.export("$summary", `Successfully retrieved channel with ID ${this.channelId}`);
    return response;
  },
};
