import microsoftOutlook from "../../microsoft_outlook.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

// Default fields for list results — body/bodyPreview excluded to keep responses compact.
// Use Get Message to fetch the full body of a specific message.
const DEFAULT_SELECT = "id,subject,from,toRecipients,receivedDateTime,sentDateTime,isRead,isDraft,hasAttachments,categories,flag,importance,conversationId";

export default {
  key: "microsoft_outlook-find-email",
  name: "Find Email",
  description:
    "Find (search, list, or count) email messages in a Microsoft Outlook mailbox via Microsoft Graph."
    + " By default a search or list request (Count Only = false) scans the WHOLE mailbox (`/me/messages`, all folders including Sent, Archive, etc.), matching what you see when searching in Outlook;"
    + " a count-only request (Count Only = true) with no explicit Folder Scope stays inbox-scoped (`/me/mailFolders/inbox/messages`) and counts ALL inbox messages by default, not just unread ones — also set `Is Read` to `false` to count only unread messages (matching Outlook's unread inbox badge)."
    + " Set Folder Scope explicitly to override this behavior for either mode."
    + " To search a shared mailbox folder instead, use **Find Shared Folder Email**."
    + " [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-1.0)",
  version: "1.1.0",
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
    subject: {
      type: "string",
      label: "Subject",
      description: "Filter messages whose subject contains this text. Example: `project update`. Adds `contains(subject,'...')` to the OData filter. Cannot be combined with `search` or `orderBy` — Graph does not support sorting alongside a `contains()` filter.",
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
      description: "Which mailbox folder to scope the query to. Leave blank to use intent-based defaulting: a search/list request (Count Only = false) scans the WHOLE mailbox (all folders); a count-only request (Count Only = true) is scoped to the inbox and counts all inbox messages by default (add `Is Read: false` for an unread-only count matching Outlook's unread inbox badge). Set explicitly to override: `all` scans the whole mailbox regardless of Count Only, or pick a well-known folder (`inbox`, `sentitems`, `drafts`, `deleteditems`, `junkemail`, `archive`). Closed option set; no value is removed or renamed.",
      options: [
        "all",
        "inbox",
        "sentitems",
        "drafts",
        "deleteditems",
        "junkemail",
        "archive",
      ],
      optional: true,
    },
    countOnly: {
      type: "boolean",
      label: "Count Only",
      description: "When `true`, returns `{ count: N }` using a single `$count` API call instead of paginating. Counts all messages in scope by default (inbox-scoped unless `Folder Scope` is set) — also set `Is Read` to `false` for an unread-only count (e.g. to match Outlook's unread inbox badge). Cannot be combined with `search`.",
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
      || this.subject
      || this.receivedAfter
      || this.receivedBefore
      || this.importance
      || hasFlagged
      || hasHasAttachments;

    if (hasSearch && (hasFilterProps || this.orderBy)) {
      throw new ConfigurationError("`search` cannot be combined with `filter`, `subject`, `from`, `receivedAfter`, `receivedBefore`, `importance`, `flagged`, `hasAttachments`, or `orderBy` — Graph does not support `$search` with `$filter` or `$orderby`. Use filter props alone, or remove them when using `search`.");
    }
    if (this.subject && this.orderBy) {
      throw new ConfigurationError("`subject` cannot be combined with `orderBy` — Microsoft Graph does not support sorting results when a `contains()` filter (used by `subject`) is applied. Remove `orderBy`, or filter without `subject` (e.g. use `filter` on an indexed property such as `receivedDateTime` instead).");
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
    if (this.subject) filterParts.push(`contains(subject,'${this.subject.replace(/'/g, "''")}')`);
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

    // Derive effective folderScope at call time:
    // - explicit value: use as-is ("all" maps to undefined for whole-mailbox, backward-compat)
    // - not set + countOnly: default to "inbox" so the count matches Outlook's inbox badge
    // - not set + search/list: undefined → whole-mailbox (/me/messages, all folders)
    let folderScope;
    if (this.folderScope) {
      folderScope = this.folderScope === "all"
        ? undefined
        : this.folderScope;
    } else if (this.countOnly) {
      folderScope = "inbox";
    } else {
      folderScope = undefined;
    }

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
    let count;

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
