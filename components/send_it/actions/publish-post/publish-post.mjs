import sendIt from "../../send_it.app.mjs";

export default {
  key: "send_it-publish-post",
  name: "Publish Post",
  description: "Publish content to social media platforms immediately. [See the documentation](https://sendit.infiniteappsai.com/docs/api)",
  version: "0.0.1",
  type: "action",
  props: {
    sendIt,
    platforms: {
      propDefinition: [
        sendIt,
        "platforms",
      ],
    },
    text: {
      propDefinition: [
        sendIt,
        "text",
      ],
    },
    mediaUrl: {
      propDefinition: [
        sendIt,
        "mediaUrl",
      ],
    },
    mediaUrls: {
      propDefinition: [
        sendIt,
        "mediaUrls",
      ],
    },
    mediaType: {
      propDefinition: [
        sendIt,
        "mediaType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sendIt.publishPost({
      $,
      platforms: this.platforms,
      text: this.text,
      mediaUrl: this.mediaUrl,
      mediaUrls: this.mediaUrls,
      mediaType: this.mediaType,
    });
    $.export("$summary", `Successfully published to ${response.results?.length || 0} platform(s)`);
    return response;
  },
};
