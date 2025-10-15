import mattermost from "../../app/mattermost.app";
import { defineAction } from "@pipedream/types";
import {
  PostMessageParams, PostMessageResponse,
} from "../../common/types";

export default defineAction({
  name: "Post Message",
  description:
    "Create a new post in a channel [See docs here](https://api.mattermost.com/#tag/posts/operation/CreatePost)",
  key: "mattermost-post-message",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mattermost,
    channelId: {
      propDefinition: [
        mattermost,
        "channelId",
      ],
    },
    message: {
      label: "Message",
      description: "The message contents, can be formatted with Markdown.",
      type: "string",
    },
    rootId: {
      label: "Root ID",
      description: "The post ID to comment on. You can use the ID of a previously created post, or get it by copying the link to a post on Mattermost's interface.",
      type: "string",
      optional: true,
    },
    fileIds: {
      label: "File IDs",
      description: "A list of file IDs to associate with the post. Note that posts are limited to 5 files maximum. Please use additional posts for more files.",
      type: "string[]",
      optional: true,
    },
    postProps: {
      label: "Props",
      description: "A general JSON property bag to attach to the post.",
      type: "object",
      optional: true,
    },
    setOnline: {
      label: "Set Online",
      description: "Whether to set the user status as online or not.",
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }): Promise<PostMessageResponse> {
    const params: PostMessageParams = {
      $,
      data: {
        channel_id: this.channelId,
        message: this.message,
        root_id: this.rootId,
        file_ids: this.fileIds,
        props: this.postProps,
      },
      params: {
        set_online: this.setOnline,
      },
    };
    const data: PostMessageResponse = await this.mattermost.postMessage(params);

    $.export("$summary", `Successfully posted message (id ${data.id})`);

    return data;
  },
});
