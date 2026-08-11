// x-pd-ai: optimized
import { pickFields } from "../../common/utils.mjs";
import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-list-conversations",
  name: "List Conversations",
  description: "Retrieve a paginated list of conversations. Can be filtered by user and/or phone numbers. Defaults to all conversations in the organization. Results are returned in descending order based on the most recent conversation. Example: call with no filters → returns up to 10 of the most recently active conversations. Use `fields` to return only specific fields per conversation. [See the documentation](https://www.openphone.com/docs/api-reference/conversations/list-conversations)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    openphone,
    phoneNumbers: {
      propDefinition: [
        openphone,
        "conversationPhoneNumbers",
      ],
    },
    userId: {
      propDefinition: [
        openphone,
        "userId",
      ],
      description: "Optional OpenPhone user ID (format `US...`) whose access scope is applied to the results, scoping the response to conversations accessible to that user. Run the **List Users** action to find user IDs.",
    },
    createdAfter: {
      propDefinition: [
        openphone,
        "createdAfter",
      ],
      description: "Optional ISO 8601 timestamp; only return conversations created after this time (e.g. `2026-08-01T00:00:00Z`).",
    },
    createdBefore: {
      propDefinition: [
        openphone,
        "createdBefore",
      ],
      description: "Optional ISO 8601 timestamp; only return conversations created before this time (e.g. `2026-08-31T23:59:59Z`).",
    },
    updatedAfter: {
      propDefinition: [
        openphone,
        "updatedAfter",
      ],
      description: "Optional ISO 8601 timestamp; only return conversations updated after this time (e.g. `2026-08-01T00:00:00Z`).",
    },
    updatedBefore: {
      propDefinition: [
        openphone,
        "updatedBefore",
      ],
      description: "Optional ISO 8601 timestamp; only return conversations updated before this time (e.g. `2026-08-31T23:59:59Z`).",
    },
    excludeInactive: {
      propDefinition: [
        openphone,
        "excludeInactive",
      ],
    },
    maxResults: {
      propDefinition: [
        openphone,
        "conversationMaxResults",
      ],
    },
    pageToken: {
      propDefinition: [
        openphone,
        "pageToken",
      ],
    },
    fields: {
      propDefinition: [
        openphone,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openphone.listConversations({
      $,
      params: {
        phoneNumbers: this.phoneNumbers,
        userId: this.userId,
        createdAfter: this.createdAfter,
        createdBefore: this.createdBefore,
        updatedAfter: this.updatedAfter,
        updatedBefore: this.updatedBefore,
        excludeInactive: this.excludeInactive,
        maxResults: this.maxResults,
        pageToken: this.pageToken,
      },
    });
    const conversations = response?.data ?? [];
    $.export("$summary", `Retrieved ${conversations.length} conversation${conversations.length === 1
      ? ""
      : "s"}`);
    return {
      ...response,
      data: pickFields(conversations, this.fields),
    };
  },
};
