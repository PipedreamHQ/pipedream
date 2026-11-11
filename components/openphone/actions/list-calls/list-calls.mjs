import { pickFields } from "../../common/utils.mjs";
import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-list-calls",
  name: "List Calls",
  description: "Retrieve a paginated list of calls from OpenPhone. Requires both a phone number ID and a participant to scope the results — the API rejects calls missing either. Use **List Phone Numbers** to find valid phone number IDs. Example: call with phoneNumberId=\"PN123abc\", participants=\"+15551234567\" → returns up to 10 recent calls between that number and that participant. Use `fields` to return only specific fields per call. [See the documentation](https://www.openphone.com/docs/api-reference/calls/list-calls)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    openphone,
    phoneNumberId: {
      propDefinition: [
        openphone,
        "phoneNumberId",
      ],
    },
    participants: {
      propDefinition: [
        openphone,
        "callParticipant",
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
      description: "Optional ISO 8601 timestamp; only return calls created after this time (e.g. `2026-08-01T00:00:00Z`).",
    },
    createdBefore: {
      propDefinition: [
        openphone,
        "createdBefore",
      ],
      description: "Optional ISO 8601 timestamp; only return calls created before this time (e.g. `2026-08-31T23:59:59Z`).",
    },
    maxResults: {
      propDefinition: [
        openphone,
        "callMaxResults",
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
    const response = await this.openphone.listCalls({
      $,
      params: {
        phoneNumberId: this.phoneNumberId,
        participants: this.participants,
        userId: this.userId,
        createdAfter: this.createdAfter,
        createdBefore: this.createdBefore,
        maxResults: this.maxResults,
        pageToken: this.pageToken,
      },
    });
    const calls = response?.data ?? [];
    $.export("$summary", `Retrieved ${calls.length} call${calls.length === 1
      ? ""
      : "s"}`);
    return {
      ...response,
      data: pickFields(calls, this.fields),
    };
  },
};
