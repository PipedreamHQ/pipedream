import app from "../../app/twitter.app";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import { CreateTweetParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets";

export default defineAction({
  key: "twitter-create-tweet",
  name: "Create Tweet",
  description: `Create a new tweet. [See the documentation](${DOCS_LINK})`,
  version: "2.1.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    text: {
      type: "string",
      label: "Text",
      description:
        "Text of the Tweet being created. Required if `Media IDs` is not set.",
      optional: true,
    },
    inReplyToTweetId: {
      type: "string",
      label: "In Reply To Tweet (ID)",
      description:
        "Tweet ID of the Tweet being replied to. Please note that this prop needs to be set if `Exclude Reply User IDs` is also set.",
      optional: true,
    },
    excludeReplyUserIds: {
      type: "string[]",
      label: "Exclude Reply User IDs",
      description:
        "A list of User IDs to be excluded from the reply Tweet thus removing a user from a thread.",
      optional: true,
    },
    mediaIds: {
      type: "string[]",
      label: "Media IDs",
      description:
        "A list of Media IDs being attached to the Tweet. This is only required if `Tagged User IDs` is set.",
      optional: true,
    },
    taggedUserIds: {
      type: "string[]",
      label: "Tagged User IDs",
      description:
        "A list of User IDs being tagged in the Tweet with Media. If the user you're tagging doesn't have photo-tagging enabled, their names won't show up in the list of tagged users even though the Tweet is successfully created.",
      optional: true,
    },
    placeId: {
      type: "string",
      label: "Place ID",
      description: "Place ID being attached to the Tweet for geo location.",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const {
      text,
      inReplyToTweetId,
      excludeReplyUserIds,
      mediaIds,
      placeId,
      taggedUserIds,
    } = this;

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
        ...((mediaIds || taggedUserIds) && {
          media: {
            media_ids: mediaIds,
            tagged_user_ids: taggedUserIds,
          },
        }),
        ...(placeId && {
          geo: {
            place_id: placeId,
          },
        }),
      },
      fallbackError: ACTION_ERROR_MESSAGE,
    };

    const response = await this.app.createTweet(params);

    $.export(
      "$summary",
      `Successfully posted tweet (ID ${response.data?.id})`,
    );

    return response;
  },
});
