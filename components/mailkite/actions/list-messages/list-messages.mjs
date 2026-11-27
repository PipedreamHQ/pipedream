import mailkite from "../../mailkite.app.mjs";

export default {
  key: "mailkite-list-messages",
  name: "List Messages",
  description:
    "List stored messages, newest first. Use this to find the `threadId` that **Send Email**'s In-Reply-To accepts, or a message ID for another MailKite step. Each result keeps its `thread_id` and adds `threadId`; both are null when the message has no usable threading id, so a reply cannot be threaded from that row. [See the documentation](https://mailkite.dev/api/messages).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    mailkite,
    limit: {
      type: "integer",
      label: "Limit",
      description:
        "Maximum number of messages to return, e.g. `50`. The API accepts 1–200 and defaults to 100 when omitted.",
      min: 1,
      max: 200,
      optional: true,
    },
    before: {
      type: "integer",
      label: "Before",
      description:
        "Cursor: return only messages received strictly before this `received_at` timestamp in milliseconds since the epoch, e.g. `1794000000000`. Use the last row's `received_at` to fetch the next page.",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description:
        "Case-insensitive substring matched over sender, recipient, and subject, e.g. `@myapp.ai` or `invoice`. Omit for no filter.",
      optional: true,
    },
  },
  async run({ $ }) {
    const rows = await this.mailkite.listMessages({
      $,
      limit: this.limit,
      before: this.before,
      search: this.search,
    });
    const messages = (rows ?? []).map((m) => ({
      ...m,
      threadId: m.thread_id ?? null,
    }));

    $.export(
      "$summary",
      `Found ${messages.length} message${messages.length === 1
        ? ""
        : "s"}`,
    );
    return messages;
  },
};
