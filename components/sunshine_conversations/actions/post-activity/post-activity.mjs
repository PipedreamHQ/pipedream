import { ConfigurationError } from "@pipedream/platform";
import sunshineConversations from "../../sunshine_conversations.app.mjs";
import { ACTIVITY_TYPES } from "../../common/constants.mjs";

export default {
  key: "sunshine_conversations-post-activity",
  name: "Post Activity",
  description: "Post a conversation activity (e.g. typing indicators or read receipts). [See the documentation](https://developer.zendesk.com/api-reference/conversations/#tag/Activities/operation/PostActivity)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    sunshineConversations,
    userId: {
      propDefinition: [
        sunshineConversations,
        "userId",
      ],
      description: "The ID of the user on whose behalf the activity is posted. Required when **Author Type** is `user`. Also filters the **Conversation ID** dropdown; leave blank for a business activity and enter the conversation ID directly.",
      optional: true,
    },
    conversationId: {
      propDefinition: [
        sunshineConversations,
        "conversationId",
        ({ userId }) => ({
          userId,
        }),
      ],
    },
    authorType: {
      propDefinition: [
        sunshineConversations,
        "authorType",
      ],
      description: "The type of the activity author. Use `business` to post on behalf of the business, or `user` to post on behalf of a user. Note: when `user` is selected, only the `conversation:read` activity type is supported by the API.",
    },
    activityType: {
      type: "string",
      label: "Activity Type",
      description: "The type of activity to post. Valid values: `conversation:read`, `typing:start`, `typing:stop`. Note: `user` authors only support `conversation:read`.",
      options: ACTIVITY_TYPES,
    },
  },
  async run({ $ }) {
    if (this.authorType === "user" && !this.userId) {
      throw new ConfigurationError("`userId` is required when `Author Type` is `user`.");
    }

    if (this.authorType === "user" && this.activityType !== "conversation:read") {
      throw new ConfigurationError("When `Author Type` is `user`, only the `conversation:read` activity type is supported.");
    }

    const author = {
      type: this.authorType,
      ...(this.authorType === "user" && {
        userId: this.userId,
      }),
    };

    const response = await this.sunshineConversations.postActivity({
      $,
      conversationId: this.conversationId,
      data: {
        author,
        type: this.activityType,
      },
    });

    $.export("$summary", `Successfully posted "${this.activityType}" activity to conversation ${this.conversationId}`);
    return response;
  },
};
