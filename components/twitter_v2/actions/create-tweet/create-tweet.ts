import app from "../../app/twitter.app";
import { defineAction } from "@pipedream/types";
import { CreateTweetParams } from "../../common/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets";

export default defineAction({
  name: "Create Tweet",
  description: `Create a new tweet. [See docs here](${DOCS_LINK})`,
  key: "twitter-create-tweet",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
    inReplyToTweetId: {
      propDefinition: [
        app,
        "inReplyToTweetId",
      ],
    },
    excludeReplyUserIds: {
      propDefinition: [
        app,
        "excludeReplyUserIds",
      ],
    },
    mediaIds: {
      propDefinition: [
        app,
        "mediaIds",
      ],
    },
    placeId: {
      propDefinition: [
        app,
        "placeId",
      ],
    },
  },
  async run({ $ }): Promise<boolean> {
    const {
      text, inReplyToTweetId, excludeReplyUserIds, mediaIds, placeId,
    } =
      this;

    const params: CreateTweetParams = {
      $,
      data: {
        text,
        ...((inReplyToTweetId || excludeReplyUserIds) && {
          reply: {
            exclude_reply_user_ids: excludeReplyUserIds,
            in_reply_to_tweet_id: inReplyToTweetId,
          },
        }),
        ...(mediaIds && {
          media: {
            media_ids: mediaIds,
          },
        }),
        ...(placeId && {
          geo: {
            place_id: placeId,
          },
        }),
      },
    };

    const response = await this.app.createTweet(params);

    $.export("$summary", "Successfully posted tweet");

    return response;
  },
});
