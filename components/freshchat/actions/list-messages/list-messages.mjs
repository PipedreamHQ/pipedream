import app from "../../freshchat.app.mjs";

export default {
  key: "freshchat-list-messages",
  name: "List Messages",
  description: "Lists all messages in a conversation. [See the documentation](https://developers.freshchat.com/api/#list_messages)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    conversationId: {
      propDefinition: [
        app,
        "conversationId",
        ({ userId }) => ({
          userId,
        }),
      ],
    },
    fromTime: {
      type: "string",
      label: "From Time",
      description: "UTC datetime to retrieve messages after this timestamp (ISO 8601 format). Example: `2025-01-01T00:00:00Z`.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      conversationId,
      fromTime,
      maxResults,
    } = this;

    const response = await app.getPaginatedResults({
      fn: app.listMessages,
      args: {
        $,
        conversationId,
      },
      resourceKey: "messages",
    });

    let messages = response.reverse();
    if (fromTime) {
      messages = messages.filter(( { created_time: ts }) => Date.parse(ts) > Date.parse(fromTime));
    }
    if (maxResults) {
      messages = messages.slice(0, maxResults);
    }

    $.export("$summary", `Listed ${messages.length} message(s)`);
    return messages;
  },
};
