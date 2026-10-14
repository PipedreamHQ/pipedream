import { ConfigurationError } from "@pipedream/platform";
import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-create-filter",
  name: "Create Filter",
  description:
    "Create a Gmail filter that automatically acts on incoming mail matching the given criteria. Provide at least one criterion and at least one action."
    + " Criteria are combined with AND: a message must match every criterion you set."
    + " Actions apply only to mail that arrives after the filter is created; existing messages are not touched."
    + " Example — skip the inbox for cancelled-event notices that were not on the user's calendar: `from` = `calendar-notification@google.com`, `query` = `\"This event has been canceled\"`, `negatedQuery` = `\"removed from your calendar\"`, `removeLabelIds` = `[\"INBOX\"]`."
    + " Label IDs must be IDs, not names — use **List Labels** to resolve a label name to its ID (system labels like `INBOX`, `STARRED`, `UNREAD`, `TRASH` can be used directly)."
    + " Use **List Filters** first to avoid creating duplicates."
    + " [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters/create).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    gmail,
    from: {
      type: "string",
      label: "From",
      description: "Match messages sent from this sender, e.g. `calendar-notification@google.com`.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "Match messages sent to this recipient, e.g. `me@example.com`.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Match messages whose subject contains this text (case-insensitive).",
      optional: true,
    },
    query: {
      type: "string",
      label: "Has the Words",
      description: "Match messages that match this Gmail search query, e.g. `\"This event has been canceled\"`. Supports the same operators as the Gmail search box (`OR`, `-`, quotes, `has:`, etc.).",
      optional: true,
    },
    negatedQuery: {
      type: "string",
      label: "Doesn't Have",
      description: "Exclude messages that match this Gmail search query, e.g. `\"removed from your calendar\"`.",
      optional: true,
    },
    hasAttachment: {
      type: "boolean",
      label: "Has Attachment",
      description: "If `true`, only match messages that have an attachment.",
      optional: true,
    },
    excludeChats: {
      type: "boolean",
      label: "Exclude Chats",
      description: "If `true`, do not match Google Chat/Hangouts messages.",
      optional: true,
    },
    size: {
      type: "integer",
      label: "Size (bytes)",
      description: "Message size in bytes to compare against. Requires **Size Comparison**.",
      optional: true,
    },
    sizeComparison: {
      type: "string",
      label: "Size Comparison",
      description: "Whether matching messages must be `larger` or `smaller` than **Size**. Requires **Size**.",
      options: [
        "larger",
        "smaller",
      ],
      optional: true,
    },
    addLabelIds: {
      type: "string[]",
      label: "Add Label IDs",
      description: "IDs of labels to add to matching messages, e.g. `[\"Label_42\", \"STARRED\"]`. Use **List Labels** to find label IDs.",
      optional: true,
    },
    removeLabelIds: {
      type: "string[]",
      label: "Remove Label IDs",
      description: "IDs of labels to remove from matching messages. Use `INBOX` to skip the inbox (archive), `UNREAD` to mark as read, `SPAM` to never send to spam.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      from, to, subject, query, negatedQuery, hasAttachment, excludeChats,
      size, sizeComparison, addLabelIds, removeLabelIds,
    } = this;

    if ((size != null) !== (sizeComparison != null)) {
      throw new ConfigurationError("`Size` and `Size Comparison` must be provided together.");
    }

    const criteria = Object.fromEntries(Object.entries({
      from,
      to,
      subject,
      query,
      negatedQuery,
      hasAttachment,
      excludeChats,
      size,
      sizeComparison,
    }).filter(([
      , v,
    ]) => v !== undefined && v !== null && v !== ""));

    if (!Object.keys(criteria).length) {
      throw new ConfigurationError("At least one criterion (From, To, Subject, Has the Words, Doesn't Have, Has Attachment, Exclude Chats, or Size) is required.");
    }

    const action = {};
    if (addLabelIds?.length) action.addLabelIds = addLabelIds;
    if (removeLabelIds?.length) action.removeLabelIds = removeLabelIds;

    if (!Object.keys(action).length) {
      throw new ConfigurationError("At least one action (Add Label IDs or Remove Label IDs) is required.");
    }

    const filter = await this.gmail.createFilter({
      criteria,
      action,
    });

    $.export("$summary", `Created filter ${filter.id}`);
    return filter;
  },
};
