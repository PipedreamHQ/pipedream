import svix from "../../svix.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "svix-list-messages",
  name: "List Messages",
  description: "List all of the application's messages. [See the docs here](https://api.svix.com/docs#tag/Message/operation/list_messages_api_v1_app__app_id__msg__get)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    svix,
    appId: {
      propDefinition: [
        svix,
        "appId",
      ],
    },
    eventType: {
      propDefinition: [
        svix,
        "eventTypes",
      ],
      type: "string",
      label: "Event Type",
      description: "The event type to retrieve",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of messages to retrieve",
      optional: true,
      default: 50,
    },
    before: {
      type: "string",
      label: "Before",
      description: "List only messages before this timestamp. Note: `before` and `after` cannot be used simultaneously.",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "List only messages after this timestamp. Note: `before` and `after` cannot be used simultaneously.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      appId,
      eventType,
      limit,
      before,
      after,
    } = this;

    if (before && after) {
      throw new ConfigurationError("Only one of `before` or `after` may be used");
    }

    const params = {
      event_types: eventType,
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
