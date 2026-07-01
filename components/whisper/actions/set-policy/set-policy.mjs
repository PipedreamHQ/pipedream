import app from "../../whisper.app.mjs";

export default {
  key: "whisper-set-policy",
  name: "Set Policy",
  description: "Set your per-tenant DNS resolver policy (`op:policy`): a default action plus allow/block name lists and named graph-backed **policy bundles** — the geo (`geo:deny:RU,KP`), category and threat (`block:tor-exits`, `block:sanctions`, …) controls. Setting any field **replaces** the whole policy. With **no** fields set, it reads the current policy back. Requires a connected Whisper account (your `whisper_live_` key with the `admin:dns` scope). [See the documentation](https://whisper.online/platform)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    policyDefault: {
      propDefinition: [
        app,
        "policyDefault",
      ],
    },
    block: {
      propDefinition: [
        app,
        "block",
      ],
    },
    allow: {
      propDefinition: [
        app,
        "allow",
      ],
    },
    bundles: {
      propDefinition: [
        app,
        "bundles",
      ],
    },
  },
  async run({ $ }) {
    const isWrite = Boolean(
      this.policyDefault
      || this.block?.length
      || this.allow?.length
      || this.bundles?.length,
    );
    const records = await this.app.setPolicy({
      $,
      policyDefault: this.policyDefault,
      block: this.block,
      allow: this.allow,
      bundles: this.bundles,
    });
    $.export("$summary", isWrite
      ? `Policy updated (${records.length} entr${records.length === 1 ? "y" : "ies"})`
      : `Read current policy (${records.length} entr${records.length === 1 ? "y" : "ies"})`);
    return records;
  },
};
