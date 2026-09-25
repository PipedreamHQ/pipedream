import { ConfigurationError } from "@pipedream/platform";
import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-attach-media",
  name: "Attach Media to Post",
  description: "Sets the media on ONE platform's settings for a post. This REPLACES that platform's existing `mediaIds`; it does not append to them. `mediaIds` come from the Create Media Upload URL and Register Uploaded Image actions, or the List Media action. `platform` defaults to the post's own `platformType` when omitted. [See the documentation](https://contentrabbitai.com/docs/api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    contentRabbitApp,
    postId: {
      propDefinition: [
        contentRabbitApp,
        "postId",
      ],
    },
    platform: {
      propDefinition: [
        contentRabbitApp,
        "platformType",
      ],
      label: "Platform",
      description: "Platform whose settings to attach the media to. Defaults to the post's own `platformType`.",
      optional: true,
    },
    mediaIds: {
      type: "string[]",
      label: "Media IDs",
      description: "Media IDs to attach to the post.",
    },
  },
  async run({ $ }) {
    if (!this.mediaIds?.length) {
      throw new ConfigurationError("mediaIds must contain at least one media ID.");
    }

    const { data: post } = await this.contentRabbitApp.getPost({
      $,
      postId: this.postId,
      params: {
        include: "platformSettings",
      },
    });

    const platform = this.platform || post?.platformType;
    if (!platform) {
      throw new ConfigurationError("No platform specified and the post has no platformType. Provide a Platform.");
    }
    const platformSettings = {
      ...(post?.platformSettings ?? {}),
    };
    platformSettings[platform] = {
      ...(platformSettings[platform] ?? {}),
      mediaIds: this.mediaIds,
    };

    const response = await this.contentRabbitApp.updatePost({
      $,
      postId: this.postId,
      data: {
        platformSettings,
      },
    });
    $.export("$summary", `Attached ${this.mediaIds.length} media item(s) to post "${this.postId}" (${platform})`);
    return response;
  },
};
