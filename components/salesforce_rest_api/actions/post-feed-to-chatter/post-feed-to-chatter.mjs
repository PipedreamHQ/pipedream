import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-post-feed-to-chatter",
  name: "Post a Message to Chatter Feed",
  description:
    "Post a feed item in Chatter. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.chatterapi.meta/chatterapi/quickreference_post_feed_item.htm)",
  version: "0.1.0",
  type: "action",
  props: {
    salesforce,
    sobjectType: {
      propDefinition: [
        salesforce,
        "objectType",
      ],
      description: "The type of object to select a record from.",
    },
    subjectId: {
      propDefinition: [
        salesforce,
        "recordId",
        (c) => ({
          objType: c.sobjectType,
        }),
      ],
      description: "The record that will parent the feed item.",
    },
    messageSegments: {
      label: "Message segments",
      description:
        "Each message segment can be a text string, which will be treated as a segment of `type: Text`, or a [message segment object](https://developer.salesforce.com/docs/atlas.en-us.chatterapi.meta/chatterapi/connect_requests_message_body_input.htm) such as `{ \"type\": \"Mention\", \"username\": \"john\" }`",
      type: "string[]",
    },
  },
  async run({ $ }) {
    const data = {
      subjectId: this.subjectId,
      feedElementType: "FeedItem",
      body: {
        messageSegments: this.messageSegments.map((segment) => {
          if (typeof segment === "string") {
            try {
              return JSON.parse(segment);
            } catch (err) {
              return {
                type: "Text",
                text: segment,
              };
            }
          }

          return segment;
        }),
      },
    };
    const response = await this.salesforce.postFeed({
      $,
      data,
    });
    response && $.export("$summary", "Successfully posted feed item");
    return response;
  },
};
