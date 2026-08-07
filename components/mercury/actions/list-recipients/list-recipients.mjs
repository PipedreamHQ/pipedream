// x-pd-ai: optimized
import mercury from "../../mercury.app.mjs";
import {
  DEFAULT_LIMIT,
  MIN_LIMIT,
  MAX_LIMIT,
  ORDER,
} from "../../common/constants.mjs";

export default {
  key: "mercury-list-recipients",
  name: "List Recipients",
  description: "List a page of payment recipients configured on the connected Mercury profile (up to **Limit** per call, default 1000; pass the last recipient's ID as **Start After** to fetch later pages). Use this to discover recipient IDs needed by **Send Payment**. Recipient IDs are UUIDs, not prefixed strings. Example: call with no parameters -> returns `{ recipients: [{ id: \"b56db170-927b-11f1-a805-27c2879b4c72\", name: \"Acme Corp\", emails: [\"billing@acme.com\"] }] }`. [See the documentation](https://docs.mercury.com/reference/getrecipients)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    mercury,
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of recipients to return. Min ${MIN_LIMIT}, max ${MAX_LIMIT}. Defaults to ${DEFAULT_LIMIT} if omitted.`,
      min: MIN_LIMIT,
      max: MAX_LIMIT,
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Sort order. `asc` or `desc`.",
      options: ORDER,
      optional: true,
    },
    startAfter: {
      type: "string",
      label: "Start After",
      description: "Cursor: return recipients after this recipient ID (UUID).",
      optional: true,
    },
    endBefore: {
      type: "string",
      label: "End Before",
      description: "Cursor: return recipients before this recipient ID (UUID).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mercury.getRecipients({
      $,
      params: {
        limit: this.limit ?? DEFAULT_LIMIT,
        order: this.order,
        start_after: this.startAfter,
        end_before: this.endBefore,
      },
    });
    const recipients = response?.recipients ?? (Array.isArray(response)
      ? response
      : []);
    $.export("$summary", `Successfully retrieved ${recipients.length} recipient(s)`);
    return response;
  },
};
