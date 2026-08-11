// x-pd-ai: optimized
import { pickFields } from "../../common/utils.mjs";
import openphone from "../../openphone.app.mjs";
import {
  DEFAULT_CALLS_LIMIT,
  MAX_LIMIT,
  MIN_LIMIT,
} from "../../common/constants.mjs";

export default {
  key: "openphone-list-calls",
  name: "List Calls",
  description: "Retrieve a paginated list of calls from OpenPhone. Requires both a phone number ID and a participant to scope the results — the API rejects calls missing either. Use **List Phone Numbers** to find valid phone number IDs. Example: call with phoneNumberId=\"PN123abc\", participants=[\"+15551234567\"] → returns up to 10 recent calls between that number and that participant. Use `fields` to return only specific fields per call. [See the documentation](https://www.openphone.com/docs/api-reference/calls/list-calls)",
  version: "0.0.1",
  type: "action",
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
        "participants",
      ],
      description: "Phone number(s) in E.164 format to filter by (e.g. `+15551234567`). Required by this endpoint — the API accepts at most 1 participant here.",
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
        "maxResults",
      ],
      description: `Maximum number of calls to return. Min ${MIN_LIMIT}, max ${MAX_LIMIT}. Defaults to ${DEFAULT_CALLS_LIMIT}.`,
      default: DEFAULT_CALLS_LIMIT,
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
