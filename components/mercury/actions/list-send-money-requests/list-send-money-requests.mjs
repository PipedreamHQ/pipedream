// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import mercury from "../../mercury.app.mjs";
import {
  DEFAULT_LIMIT,
  MIN_LIMIT,
  MAX_LIMIT,
  SEND_MONEY_REQUEST_STATUSES,
} from "../../common/constants.mjs";

export default {
  key: "mercury-list-send-money-requests",
  name: "List Send Money Requests",
  description: "List send money approval requests for the organization. Optionally filter by account and status. Use this to discover pending approvals and their `requestId`. Example: call with `status: \"pendingApproval\"` -> returns `{ requests: [{ requestId: \"3f1a9c22-8b87-11f1-a9e5-6b3dd34242f2\", accountId: \"69c8b0ee-8b87-11f1-a9e5-e7cd8f0e3f51\", amount: 100.5, paymentMethod: \"ach\", status: \"pendingApproval\" }], page: { nextPage: null, previousPage: null } }`. [See the documentation](https://docs.mercury.com/reference/listsendmoneyapprovalrequests)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    mercury,
    accountId: {
      propDefinition: [
        mercury,
        "account",
      ],
      label: "Account ID",
      description: "Filter requests to a single Mercury account (UUID). Run **List Accounts** to obtain a valid ID.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter requests by approval status.",
      options: SEND_MONEY_REQUEST_STATUSES,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of requests to return. Min ${MIN_LIMIT}, max ${MAX_LIMIT}. Defaults to ${DEFAULT_LIMIT} if omitted.`,
      min: MIN_LIMIT,
      max: MAX_LIMIT,
      optional: true,
    },
    startAfter: {
      type: "string",
      label: "Start After",
      description: "Cursor: return requests after this request ID (UUID). Cannot be combined with **End Before**.",
      optional: true,
    },
    endBefore: {
      type: "string",
      label: "End Before",
      description: "Cursor: return requests before this request ID (UUID). Cannot be combined with **Start After**.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.startAfter && this.endBefore) {
      throw new ConfigurationError("**Start After** and **End Before** are mutually exclusive — provide only one.");
    }
    const response = await this.mercury.getSendMoneyRequests({
      $,
      params: {
        accountId: this.accountId,
        status: this.status,
        limit: this.limit ?? DEFAULT_LIMIT,
        start_after: this.startAfter,
        end_before: this.endBefore,
      },
    });
    const requests = response?.requests ?? (Array.isArray(response)
      ? response
      : []);
    $.export("$summary", `Successfully retrieved ${requests.length} send money request(s)`);
    return response;
  },
};
