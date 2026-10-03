import app from "../../whisper.app.mjs";

export default {
  key: "whisper-get-logs",
  name: "Get Logs",
  description: "Query your recent DNS / connection / allocation activity from warm storage (`op:logs`), confined to your own tenant. Narrow by agent, event kind, and a time window (relative like `-1h`, epoch-ms, or RFC-3339). Returns one record per event (empty when the window has no activity). Requires a connected Whisper account (your `whisper_live_` key). [See the documentation](https://whisper.online/platform)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    logsAgent: {
      propDefinition: [
        app,
        "logsAgent",
      ],
    },
    logsKind: {
      propDefinition: [
        app,
        "logsKind",
      ],
    },
    from: {
      propDefinition: [
        app,
        "from",
      ],
    },
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const records = await this.app.getLogs({
      $,
      agent: this.logsAgent,
      kind: this.logsKind,
      from: this.from,
      to: this.to,
      limit: this.limit,
    });
    $.export("$summary", `Retrieved ${records.length} event(s)`);
    return records;
  },
};
