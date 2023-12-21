import salesForceRestApi from "../../salesforce_rest_api.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "salesforce_rest_api-post-feed-to-chatter",
  name: "Post a Message to Chatter Feed",
  description: toSingleLineString(`
    Posts a message to the Chatter Feed.
    [See doc](https://developer.salesforce.com/docs/atlas.en-us.chatterapi.meta/chatterapi/quickreference_post_feed_item.htm)
  `),
  version: "0.0.4",
  type: "action",
  props: {
    salesForceRestApi,
    text: {
      label: "Text body",
      description: "Text body.",
      type: "string",
    },
    subjectId: {
      label: "Subject ID",
      description: "Specify the user, group, or record that will parent the feed item.",
      type: "string",
    },
  },
  async run({ $ }) {
    const params = {
      text: this.text,
      subjectId: this.subjectId,
      feedElementType: "FeedItem",
    };
    const response = await this.salesForceRestApi.postFeed({
      $,
      params,
    });
    response && $.export("$summary", "Successfully added message to chatter feed");
    return response;
  },
};
