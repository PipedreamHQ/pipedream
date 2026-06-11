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
  version: "0.3.0",
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
    folderScope: {
      type: "string",
      label: "Folder Scope",
      description: "Scope the search: `inbox` limits to the inbox only (prevents Sent/Drafts/Junk from inflating counts). `all` (default) searches all mail folders.",
      options: [
        "all",
        "inbox",
      ],
      default: "all",
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
      description: "The ID of a folder in a shared mailbox. Requires `userId` to be set. Routes the search to `/users/{userId}/mailFolders/{sharedFolderId}/messages`.",
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

    if (hasSearch && this.countOnly) {
      throw new ConfigurationError("`search` cannot be combined with `countOnly` — Graph does not support `$count` with `$search`.");
    }
    if (hasSearch && (this.filter || this.orderBy)) {
      throw new ConfigurationError("`search` cannot be combined with `filter` or `orderBy` — Graph does not support `$search` with `$filter` or `$orderby`. Use `filter` alone, or remove `filter`/`orderBy` when using `search`.");
    }
    if (this.sharedFolderId && !this.userId) {
      throw new ConfigurationError("`sharedFolderId` requires `userId` to be set — provide the UPN or object ID of the shared mailbox owner.");
    }

    const filterParts = [];
    if (hasIsRead) filterParts.push(`isRead eq ${this.isRead}`);
    if (this.filter) filterParts.push(`(${this.filter})`);

    // Graph cannot combine $search with $filter (which isRead generates).
    // Auto-convert to a subject contains() filter so both constraints are honoured.
    if (hasSearch && hasIsRead) {
      const escaped = this.search.replace(/'/g, "''");
      filterParts.push(`contains(subject,'${escaped}')`);
      hasSearch = false;
    }
    const combinedFilter = filterParts.join(" and ") || undefined;

    if (this.countOnly) {
      const result = await this.microsoftOutlook.countMessages({
        userId: this.userId,
        folderScope: this.folderScope,
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
      : this.folderScope === "inbox"
        ? this.microsoftOutlook.listInboxMessages
        : this.microsoftOutlook.listMessages;

    const fnArgs = {
      userId: this.userId,
      ...(this.sharedFolderId
        ? {
          sharedFolderId: this.sharedFolderId,
        }
        : {}),
    };

    let emails = [];

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
      const items = this.microsoftOutlook.paginate({
        fn: listFn,
        args: {
          ...fnArgs,
          params: {
            "$filter": combinedFilter,
            "$orderby": this.orderBy,
            ...selectParam,
            ...expandParam,
          },
        },
        max: this.maxResults,
      });
      for await (const item of items) {
        emails.push(item);
      }
    }

    $.export("$summary", `Found ${emails.length} message${emails.length !== 1
      ? "s"
      : ""}`);
    return emails;
  },
};
