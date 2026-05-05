import microsoftOutlook from "../../microsoft_outlook.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "microsoft_outlook-find-email",
  name: "Find Email",
  description: "Search for an email in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-messages)",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoftOutlook,
    userId: {
      propDefinition: [
        microsoftOutlook,
        "userId",
      ],
      optional: true,
      description: "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox.",
    },
    info: {
      type: "alert",
      alertType: "info",
      content: "**Note:** `$search` cannot be used together with `$filter` or `$orderby`. When you specify `$filter`, the service infers a sort order for the results. If you use both `$orderby` and `$filter` to get messages, because the server always infers a sort order for the results of a `$filter`, you must [specify properties in certain ways](https://learn.microsoft.com/en-us/graph/api/user-list-messages#using-filter-and-orderby-in-the-same-query).",
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
    includeAttachments: {
      type: "boolean",
      label: "Include Attachments",
      description: "If true, returns additional info for message attachments.",
      optional: true,
      default: false,
    },
    select: {
      type: "string",
      label: "Properties to return ($select)",
      description: "Comma-separated Microsoft Graph [message](https://learn.microsoft.com/en-us/graph/api/resources/message) property names to return for each message (for example `id,subject,from,receivedDateTime`). When empty, the API returns its default property set. Use this to shrink responses and downstream token usage.",
      optional: true,
    },
  },
  methods: {
    ensureQuotes(str) {
      str = str.trim();
      str = str.replace(/^['"]?/, "").replace(/['"]?$/, "");
      return `"${str}"`;
    },
  },
  async run({ $ }) {
    if (this.search && (this.filter || this.orderBy)) {
      throw new ConfigurationError("`$search` not supported when using `$filter` or `$orderby`.");
    }

    const normalizedSelect = this.select?.trim()
      ? this.select.split(",")
        .map((p) => p.trim())
        .filter(Boolean)
        .join(",")
      : "";
    const selectParams = normalizedSelect
      ? {
        "$select": normalizedSelect,
      }
      : {};

    let emails = [];

    if (!this.search) {
      const items = this.microsoftOutlook.paginate({
        fn: this.microsoftOutlook.listMessages,
        args: {
          $,
          userId: this.userId,
          params: {
            "$filter": this.filter,
            "$orderby": this.orderBy,
            ...selectParams,
            ...(this.includeAttachments
              ? {
                "$expand": "attachments",
              }
              : {}),
          },
        },
        max: this.maxResults,
      });

      for await (const item of items) {
        emails.push(item);
      }
    } else {
      const { value } = await this.microsoftOutlook.listMessages({
        $,
        userId: this.userId,
        params: {
          "$search": this.ensureQuotes(this.search),
          "$top": this.maxResults,
          ...selectParams,
          ...(this.includeAttachments
            ? {
              "$expand": "attachments",
            }
            : {}),
        },
      });

      emails = value;
    }

    $.export("$summary", `Successfully retrieved ${emails.length} message${emails.length != 1
      ? "s"
      : ""}.`);
    return emails;
  },
};
