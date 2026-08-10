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
    + " By default a search or list request (`countOnly` = false) scans the WHOLE mailbox (all folders including Sent, Archive, etc.), matching what you see when searching in Outlook;"
    + " a count-only request (`countOnly` = true) with no explicit `folderScope` stays inbox-scoped and counts ALL inbox messages by default, not just unread ones — also set `isRead` to `false` to count only unread messages (matching Outlook's unread inbox badge)."
    + " Set `folderScope` explicitly to override this behavior for either mode."
    + " To search a shared mailbox, set `userId` (the mailbox owner's UPN or ID); add `sharedFolderId` to target a specific folder within it."
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
      propDefinition: [
        microsoftOutlook,
        "subject",
      ],
      label: "Subject",
      description: "Filter messages whose subject contains this text. Example: `project update`. Adds `contains(subject,'...')` to the OData filter. Cannot be combined with `search`. Can be combined with `orderBy`, but Graph requires the sort property to also be filtered — see `Order By`.",
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
      description: "OData filter expression. Example: `contains(subject, 'meeting')` or `receivedDateTime ge 2024-01-01T00:00:00Z`. When combined with `isRead`, filters are joined with `and`. Cannot be combined with `search`. When combined with `orderBy`, Graph's filter/orderby ordering rules are your responsibility — this action cannot introspect a raw filter to reorder it. [See filter documentation](https://learn.microsoft.com/en-us/graph/filter-query-parameter).",
    },
    orderBy: {
      propDefinition: [
        microsoftOutlook,
        "orderBy",
      ],
      description: "Order results by a message property. Example: `receivedDateTime desc` (newest first). Microsoft Graph requires every property in `$orderby` to also appear in `$filter`, before any properties that don't — this action arranges the filter automatically, so pair `orderBy` with a matching filter (e.g. sort by `receivedDateTime` together with a `Received After`/`Received Before` value). Sorting by a property that isn't filtered returns an `InefficientFilter` error. Cannot be combined with `search`.",
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
    // Normalize an `$orderby` property token to the internal key used to tag the
    // generated filter conditions, so we can match a sort property to its filter.
    canonicalOrderKey(prop) {
      const p = (prop || "").toLowerCase();
      if (p === "from" || p.startsWith("from/")) return "from";
      if (p === "flag" || p.startsWith("flag/")) return "flag/flagstatus";
      return p || undefined;
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
    if (this.sharedFolderId && !this.userId) {
      throw new ConfigurationError("`sharedFolderId` requires `userId` to be set — provide the UPN or object ID of the shared mailbox owner.");
    }
    if (this.folderScope && this.sharedFolderId) {
      throw new ConfigurationError("`folderScope` and `sharedFolderId` cannot be used together — use one or the other.");
    }

    // Structured filter conditions, each tagged with the message property it
    // constrains, so the $orderby-ordering rules below can match/reorder them.
    const filterParts = [];
    if (hasIsRead) filterParts.push({
      key: "isread",
      expr: `isRead eq ${this.isRead}`,
    });
    if (this.from) filterParts.push({
      key: "from",
      expr: `from/emailAddress/address eq '${this.from.replace(/'/g, "''")}'`,
    });
    if (this.subject) filterParts.push({
      key: "subject",
      expr: `contains(subject,'${this.subject.replace(/'/g, "''")}')`,
    });
    if (this.receivedAfter) filterParts.push({
      key: "receiveddatetime",
      expr: `receivedDateTime ge ${this.receivedAfter}`,
    });
    if (this.receivedBefore) filterParts.push({
      key: "receiveddatetime",
      expr: `receivedDateTime le ${this.receivedBefore}`,
    });
    if (this.importance) filterParts.push({
      key: "importance",
      expr: `importance eq '${this.importance}'`,
    });
    if (hasFlagged) filterParts.push({
      key: "flag/flagstatus",
      expr: `flag/flagStatus eq '${this.flagged
        ? "flagged"
        : "notFlagged"}'`,
    });
    if (hasHasAttachments) filterParts.push({
      key: "hasattachments",
      expr: `hasAttachments eq ${this.hasAttachments}`,
    });

    // Graph cannot combine $search with $filter (which isRead generates).
    // Auto-convert to a subject contains() filter so both constraints are honoured.
    if (hasSearch && hasIsRead) {
      const escaped = this.search.replace(/'/g, "''");
      filterParts.push({
        key: "subject",
        expr: `contains(subject,'${escaped}')`,
      });
      hasSearch = false;
    }

    // A raw user `filter` is opaque — we can't tell which properties it references.
    const rawFilter = this.filter
      ? `(${this.filter})`
      : undefined;

    // Enforce Graph's rules for using $filter and $orderby together (list mode only;
    // $orderby is not sent for count requests). See
    // https://learn.microsoft.com/en-us/graph/api/user-list-messages :
    //   1. Every property in $orderby must also appear in $filter.
    //   2. Shared properties appear in the same order in both.
    //   3. $orderby properties appear in $filter before any that aren't.
    // Failing these returns InefficientFilter ("...too complex for this operation.").
    // We can only introspect the structured conditions above, so when a raw `filter`
    // is present we skip validation/reordering and defer entirely to Graph.
    if (this.orderBy && !this.countOnly && !rawFilter) {
      const orderKeys = this.orderBy
        .split(",")
        .map((clause) => this.canonicalOrderKey(clause.trim().split(/\s+/)[0]))
        .filter(Boolean);

      // Reorder so the sorted properties lead the filter, in $orderby order.
      const leading = [];
      for (const key of orderKeys) {
        for (const part of filterParts) {
          if (part.key === key && !leading.includes(part)) {
            leading.push(part);
          }
        }
      }
      const rest = filterParts.filter((part) => !leading.includes(part));
      filterParts.length = 0;
      filterParts.push(...leading, ...rest);
    }

    const combinedFilter = [
      ...filterParts.map((part) => part.expr),
      ...(rawFilter
        ? [
          rawFilter,
        ]
        : []),
    ].join(" and ") || undefined;

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
