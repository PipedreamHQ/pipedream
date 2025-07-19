import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-list-channels",
  name: "List Channels",
  description: "List a user's chat channels. [See the documentation](https://developers.zoom.us/docs/api/team-chat/#tag/chat-channels/GET/chat/users/{userId}/channels)",
  version: "0.1.5",
  type: "action",
  props: {
    zoom,
    max: {
      propDefinition: [
        zoom,
        "max",
      ],
    },
    nextPageToken: {
      propDefinition: [
        zoom,
        "nextPageToken",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zoom.listChannels({
      $,
      params: {
        page_size: this.max,
        next_page_token: this.nextPageToken,
      },
    });
    if (response.channels?.length) {
      $.export("$summary", `Successfully retreived ${response.channels.length} channel${response.channels.length === 1
        ? ""
        : "s"} `);
    }
    return response;
  },
};
