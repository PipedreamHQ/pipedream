import sendIt from "../../sendit.app.mjs";

export default {
  key: "sendit-validate-content",
  name: "Validate Content",
  description: "Check if content meets platform requirements before publishing. [See the documentation](https://sendit.infiniteappsai.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const response = await this.sendIt.validateContent({
      $,
      platforms: this.platforms,
      text: this.text,
      mediaUrl: this.mediaUrl,
      mediaUrls: this.mediaUrls,
      mediaType: this.mediaType,
    });
    $.export("$summary", response.valid
      ? "Content is valid for all platforms"
      : `Content has ${response.errors?.length || 0} validation error(s)`);
    return response;
  },
};
