import app from "../../whisper.app.mjs";

export default {
  key: "whisper-list-agents",
  name: "List Agents",
  description: "List your fleet (`op:list`), confined to your own tenant — your agents, identities, or DNS records. Each record carries the item's label, FQDN, address, agent id, creation time, and state. Requires a connected Whisper account (your `whisper_live_` key). [See the documentation](https://whisper.online/platform)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    kind: {
      propDefinition: [
        app,
        "listKind",
      ],
    },
  },
  async run({ $ }) {
    const records = await this.app.listAgents({
      $,
      kind: this.kind,
    });
    $.export("$summary", `Listed ${records.length} ${this.kind || "agents"}`);
    return records;
  },
};
