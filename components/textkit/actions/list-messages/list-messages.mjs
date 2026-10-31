import textkit from "../../textkit.app.mjs";

export default {
  key: "textkit-list-messages",
  name: "List Messages",
  description: "List sent and received messages, newest first, with optional filters."
    + " Each message includes `id`, `to`, `from`, `body`, `direction` and `status` (e.g. `delivered`, `failed`, `received`)."
    + " Use after **Send SMS** to check delivery, or to read replies."
    + " [See the documentation](https://jointextkit.com/docs/messages)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    textkit,
    direction: {
      type: "string",
      label: "Direction",
      description: "Only `inbound` (received) or `outbound` (sent) messages, e.g. `inbound`. Leave empty for both.",
      options: [
        "inbound",
        "outbound",
      ],
      optional: true,
    },
    number: {
      type: "string",
      label: "Number",
      description: "Only messages to or from this phone number, in E.164 format (e.g. `+14155550132`)",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Only messages with this status. One of `queued`, `sent`, `delivered`, `failed`, `blocked`, `received`, e.g. `delivered`.",
      options: [
        "queued",
        "sent",
        "delivered",
        "failed",
        "blocked",
        "received",
      ],
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The most messages to return (e.g. `50`)",
      default: 50,
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const max = this.maxResults ?? 50;
    const messages = [];
    let cursor;
    do {
      const page = await this.textkit.listMessages({
        $,
        params: {
          direction: this.direction || undefined,
          number: this.number || undefined,
          status: this.status || undefined,
          limit: Math.min(100, max - messages.length),
          cursor,
        },
      });
      messages.push(...(page.data ?? []));
      cursor = page.has_more
        ? page.next_cursor
        : undefined;
    } while (cursor && messages.length < max);
    $.export("$summary", `Found ${messages.length} message${messages.length === 1
      ? ""
      : "s"}`);
    return messages.slice(0, max);
  },
};
