// x-pd-ai: optimized
import { pickFields } from "../../common/utils.mjs";
import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-list-messages",
  name: "List Messages",
  description: "Retrieve a paginated list of messages from OpenPhone, scoped to a phone number and a participant — both are required by the API. Optionally narrow further to one conversation with `conversationId`. Example: call with phoneNumberId=\"PN123abc\", participants=[\"+15551234567\"] → returns up to 10 recent messages between that number and that participant. Use `fields` to return only specific fields per message. [See the documentation](https://www.openphone.com/docs/api-reference/messages/list-messages)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    openphone,
    conversationId: {
      propDefinition: [
        openphone,
        "conversationId",
      ],
      optional: true,
    },
    phoneNumberId: {
      propDefinition: [
        openphone,
        "phoneNumberId",
      ],
    },
    participants: {
      propDefinition: [
        openphone,
        "messageParticipants",
      ],
    },
    userId: {
      propDefinition: [
        openphone,
        "userId",
      ],
    },
    createdAfter: {
      propDefinition: [
        openphone,
        "createdAfter",
      ],
      description: "Optional ISO 8601 timestamp; only return messages created after this time.",
    },
    createdBefore: {
      propDefinition: [
        openphone,
        "createdBefore",
      ],
      description: "Optional ISO 8601 timestamp; only return messages created before this time.",
    },
    maxResults: {
      propDefinition: [
        openphone,
        "messageMaxResults",
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
    const response = await this.openphone.listMessages({
      $,
      params: {
        conversationId: this.conversationId,
        phoneNumberId: this.phoneNumberId,
        participants: this.participants,
        userId: this.userId,
        createdAfter: this.createdAfter,
        createdBefore: this.createdBefore,
        maxResults: this.maxResults,
        pageToken: this.pageToken,
      },
    });
    const messages = response?.data ?? [];
    $.export("$summary", `Retrieved ${messages.length} message${messages.length === 1
      ? ""
      : "s"}`);
    return {
      ...response,
      data: pickFields(messages, this.fields),
    };
  },
};
