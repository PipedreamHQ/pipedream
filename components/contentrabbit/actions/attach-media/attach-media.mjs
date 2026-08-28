import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-attach-media",
  name: "Attach Media to Post",
  description: "Attach one or more media items to a post's platform settings. [See the documentation](https://contentrabbitai.com/docs/api)",
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
      type: "string",
      label: "Platform",
      description: "Platform to attach the media to. Defaults to the post's primary platform.",
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
      throw new Error("mediaIds must contain at least one media ID.");
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
      throw new Error("No platform specified and the post has no platformType. Provide a Platform.");
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
