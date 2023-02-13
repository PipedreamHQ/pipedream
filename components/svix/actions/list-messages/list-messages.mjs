import svix from "../../svix.app.mjs";

export default {
  key: "svix-list-messages",
  name: "List Messages",
  description: "List all of the application's messages. [See the docs here](https://api.svix.com/docs#tag/Message/operation/list_messages_api_v1_app__app_id__msg__get)",
  version: "0.0.1",
  type: "action",
  props: {
    svix,
    appId: {
      propDefinition: [
        svix,
        "appId",
      ],
    },
    eventTypes: {
      propDefinition: [
        svix,
        "eventTypes",
      ],
      description: "The event types to retrieve",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of messages to retreive",
      optional: true,
      default: 50,
    },
    before: {
      type: "string",
      label: "Before",
      description: "List only messages before this timestamp",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "List only messages after this timestamp",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      appId,
      eventTypes,
      limit,
      before,
      after,
    } = this;

    const params = {
      eventTypes,
      before,
      after,
    };

    const messages = [];
    while (true) {
      const {
        data, iterator, done,
      } = await this.svix.listMessages(appId, {
        params,
        $,
      });
      messages.push(...data);
      if (done || messages.length >= limit) {
        break;
      }
      params.iterator = iterator;
    }
    if (messages.length > limit) {
      messages.length = limit;
    }

    $.export("$summary", `Found ${messages.length} message(s)`);

    return messages;
  },
};
