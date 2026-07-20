import microsoftOutlook from "../../microsoft_outlook.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

// Default fields for list results — body/bodyPreview excluded to keep responses compact.
// Use Get Message to fetch the full body of a specific message.
const DEFAULT_SELECT = "id,subject,from,toRecipients,receivedDateTime,sentDateTime,isRead,isDraft,hasAttachments,categories,flag,importance,conversationId";

export default {
  key: "microsoft_outlook-find-email",
  name: "Find Email",
  description:
    "Search and filter email messages in Microsoft Outlook."
    + " Returns metadata only (subject, from, date, isRead, hasAttachments, etc.) — body is excluded from list results."
    + " Use **Get Message** to fetch the full body or attachment details for a specific message ID."
    + " Use **Get Current User** first when the user says 'my email' to confirm identity."
    + " Set `isRead: false` to find unread messages — builds the OData filter automatically, no filter syntax required."
    + " Set `folderScope: \"inbox\"` to restrict results to the inbox only, preventing Sent/Drafts/Junk from inflating counts."
    + " Set `countOnly: true` to return `{ count: N }` in a single API call without paginating — ideal for 'how many unread' queries."
    + " `search` and `isRead` can be used together — when both are set, `search` is automatically converted to `contains(subject,...)` so both constraints are applied (Graph cannot combine KQL `$search` with OData `$filter` natively). Note: this narrows the match scope to subject only, whereas a bare `$search` also matches body and from."
    + " `countOnly` cannot be combined with `search`."
    + " For shared mailboxes, set both `userId` and `sharedFolderId`."
    + " Example: `find-email(isRead=false, folderScope=\"inbox\", countOnly=true)` → `{ count: 47 }` for unread inbox count."
    + " Example: `find-email(search=\"Eval-Festivus\", folderScope=\"inbox\", maxResults=5)` → array of messages with `id`, `subject`, `from`, `receivedDateTime`, `isRead` (no body — call Get Message next for body)."
    + " [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-messages)",
  version: "1.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftOutlook,
    isRead: {
      type: "boolean",
      label: "Is Read",
      description: "Filter by read/unread status. `false` finds unread messages; `true` finds read messages. Adds `isRead eq {value}` to the OData filter automatically. Can be combined with `search` — when both are set, `search` is automatically converted to a `contains(subject,...)` filter and joined with the `isRead` condition.",
      optional: true,
    },
    from: {
      type: "string",
      label: "From",
      description: "Filter by sender email address. Example: `sender@example.com`.",
      optional: true,
    },
    receivedAfter: {
      type: "string",
      label: "Received After",
      description: "Return messages received on or after this date/time (ISO 8601). Example: `2024-01-01T00:00:00Z`.",
      optional: true,
    },
    receivedBefore: {
      type: "string",
      label: "Received Before",
      description: "Return messages received on or before this date/time (ISO 8601). Example: `2024-01-31T23:59:59Z`.",
      optional: true,
    },
    importance: {
      type: "string",
      label: "Importance",
      description: "Filter by message importance level.",
      optional: true,
      options: [
        "low",
        "normal",
        "high",
      ],
    },
    flagged: {
      type: "boolean",
      label: "Flagged",
      description: "`true` returns flagged messages; `false` returns unflagged messages.",
      optional: true,
    },
    hasAttachments: {
      type: "boolean",
      label: "Has Attachments",
      description: "`true` returns only messages with attachments; `false` returns only messages without attachments.",
      optional: true,
    },
    folderScope: {
      type: "string",
      label: "Folder Scope",
      description: "Scope the search. Default is `inbox`, which limits results to the inbox only and prevents Sent/Drafts/Junk from inflating counts. Set to `all` to search across all mail folders. Can be one of `all`, `inbox`, `sentitems`, `drafts`, `deleteditems`, `junkemail`, `archive`, or a folder ID. Use the **List Folders** action to get folder IDs. Not for use with `sharedFolderId`.",
      options: [
        "all",
        "inbox",
        "sentitems",
        "drafts",
        "deleteditems",
        "junkemail",
        "archive",
      ],
      default: "inbox",
      optional: true,
    },
    countOnly: {
      type: "boolean",
      label: "Count Only",
      description: "When `true`, returns `{ count: N }` using a single `$count` API call instead of paginating. Ideal for 'how many unread emails' queries. Cannot be combined with `search`.",
      optional: true,
      default: false,
    },
    search: {
      propDefinition: [
        microsoftOutlook,
        "search",
      ],
      description: "Search for an email in Microsoft Outlook. Can search for specific message properties such as `\"to:example@example.com\"` or `\"subject:example\"`. If the property is excluded, the search targets the default properties `from`, `subject`, and `body`. For example, `\"pizza\"` will search for messages with the word `pizza` in the subject, body, or from address, but `\"to:example@example.com\"` will only search for messages to `example@example.com`. Not for use with `$filter` or `$orderby`. Response will not include total message count if `search` is used.",
    },
    filter: {
      propDefinition: [
        microsoftOutlook,
        "filter",
      ],
      description: "OData filter expression. Example: `contains(subject, 'meeting')` or `receivedDateTime ge 2024-01-01T00:00:00Z`. When combined with `isRead`, filters are joined with `and`. Cannot be combined with `search`. [See filter documentation](https://learn.microsoft.com/en-us/graph/filter-query-parameter).",
    },
    orderBy: {
      propDefinition: [
        microsoftOutlook,
        "orderBy",
      ],
    },
    maxResults: {
      propDefinition: [
        microsoftOutlook,
        "maxResults",
      ],
    },
    select: {
      type: "string",
      label: "Select Fields",
      description: "Comma-separated message property names to include in results, e.g. `id,subject,from,receivedDateTime,isRead`. Leave empty to use the action's default field set (metadata only, excludes body/bodyPreview).",
      optional: true,
    },
    includeAttachments: {
      type: "boolean",
      label: "Include Attachments",
      description: "When `true`, expands attachment metadata in each result. Use **Get Message** instead when you need a single message's full body and attachments.",
      optional: true,
      default: false,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID or UPN of a shared mailbox. Omit to use the authenticated user's mailbox.",
      optional: true,
    },
    sharedFolderId: {
      type: "string",
      label: "Shared Folder ID",
      description: "The ID of a folder in a shared mailbox. Requires `userId` to be set. Routes the search to `/users/{userId}/mailFolders/{sharedFolderId}/messages`. Not for use with `folderScope`.",
      optional: true,
    },
  },
  methods: {
    ensureQuotes(str) {
      const cleaned = str.trim().replace(/^['"]?/, "")
        .replace(/['"]?$/, "");
      const escaped = cleaned.replace(/"/g, "\\\"");
      return `"${escaped}"`;
    },
  },
  async run({ $ }) {
    let hasSearch = Boolean(this.search);
    const hasIsRead = this.isRead !== undefined && this.isRead !== null;
    const hasFlagged = this.flagged !== undefined && this.flagged !== null;
    const hasHasAttachments = this.hasAttachments !== undefined && this.hasAttachments !== null;

    if (hasSearch && this.countOnly) {
      throw new ConfigurationError("`search` cannot be combined with `countOnly` — Graph does not support `$count` with `$search`.");
    }
    const hasFilterProps = this.filter
      || this.from
      || this.receivedAfter
      || this.receivedBefore
      || this.importance
      || hasFlagged
      || hasHasAttachments;

    if (hasSearch && (hasFilterProps || this.orderBy)) {
      throw new ConfigurationError("`search` cannot be combined with `filter`, `from`, `receivedAfter`, `receivedBefore`, `importance`, `flagged`, `hasAttachments`, or `orderBy` — Graph does not support `$search` with `$filter` or `$orderby`. Use filter props alone, or remove them when using `search`.");
    }
    if (this.sharedFolderId && !this.userId) {
      throw new ConfigurationError("`sharedFolderId` requires `userId` to be set — provide the UPN or object ID of the shared mailbox owner.");
    }
    if (this.folderScope && this.folderScope !== "inbox" && this.sharedFolderId) {
      throw new ConfigurationError("`folderScope` and `sharedFolderId` cannot be used together — use one or the other.");
    }

    const filterParts = [];
    if (hasIsRead) filterParts.push(`isRead eq ${this.isRead}`);
    if (this.from) filterParts.push(`from/emailAddress/address eq '${this.from.replace(/'/g, "''")}'`);
    if (this.receivedAfter) filterParts.push(`receivedDateTime ge ${this.receivedAfter}`);
    if (this.receivedBefore) filterParts.push(`receivedDateTime le ${this.receivedBefore}`);
    if (this.importance) filterParts.push(`importance eq '${this.importance}'`);
    if (hasFlagged) filterParts.push(`flag/flagStatus eq '${this.flagged
      ? "flagged"
      : "notFlagged"}'`);
    if (hasHasAttachments) filterParts.push(`hasAttachments eq ${this.hasAttachments}`);
    if (this.filter) filterParts.push(`(${this.filter})`);

    // Graph cannot combine $search with $filter (which isRead generates).
    // Auto-convert to a subject contains() filter so both constraints are honoured.
    if (hasSearch && hasIsRead) {
      const escaped = this.search.replace(/'/g, "''");
      filterParts.push(`contains(subject,'${escaped}')`);
      hasSearch = false;
    }
    const combinedFilter = filterParts.join(" and ") || undefined;

    const folderScope = this.folderScope === "all"
      ? undefined
      : this.folderScope;

    if (this.countOnly) {
      const result = await this.microsoftOutlook.countMessages({
        userId: this.userId,
        folderScope,
        sharedFolderId: this.sharedFolderId,
        filter: combinedFilter,
      });
      const count = result["@odata.count"] ?? 0;
      $.export("$summary", `Count: ${count} messages`);
      return {
        count,
      };
    }

    const normalizedSelect = this.select?.trim()
      ? this.select.split(",").map((p) => p.trim())
        .filter(Boolean)
        .join(",")
      : DEFAULT_SELECT;
    const selectParam = {
      "$select": normalizedSelect,
    };
    const expandParam = this.includeAttachments
      ? {
        "$expand": "attachments",
      }
      : {};

    const listFn = this.sharedFolderId
      ? this.microsoftOutlook.listSharedFolderMessages
      : this.microsoftOutlook.listMessages;

    const fnArgs = {
      userId: this.userId,
      folderScope,
      ...(this.sharedFolderId
        ? {
          sharedFolderId: this.sharedFolderId,
        }
        : {}),
    };

    let emails = [];
    let count = 0;

    if (hasSearch) {
      const { value } = await listFn({
        ...fnArgs,
        params: {
          "$search": this.ensureQuotes(this.search),
          "$top": this.maxResults,
          ...selectParam,
          ...expandParam,
        },
      });
      emails = value || [];
    } else {
      const meta = {};
      const items = this.microsoftOutlook.paginate({
        fn: listFn,
        args: {
          ...fnArgs,
          params: {
            "$filter": combinedFilter,
            "$orderby": this.orderBy,
            "$count": "true",
            ...selectParam,
            ...expandParam,
          },
        },
        max: this.maxResults,
        meta,
      });
      for await (const item of items) {
        emails.push(item);
      }
      count = meta["@odata.count"];
    }

    if (count != null) {
      $.export("$summary", `Found ${count} total message${count !== 1
        ? "s"
        : ""}`);
      return {
        count,
        emails,
      };
    } else {
      $.export("$summary", "Found messages matching criteria");
      return {
        emails,
      };
    }
  },
};
