import docspring from "../../docspring.app.mjs";

export default {
  key: "docspring-combine-pdfs",
  name: "Combine PDFs",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Merge multiple submissions, templates, or files into a single PDF. [See the documentation](https://docspring.com/docs).",
  type: "action",
  props: {
    docspring,
    sourcePdfs: {
      type: "string[]",
      label: "Source PDFs",
      description:
        "Each item is a JSON object, e.g. `{\"type\":\"submission\",\"id\":\"sub_...\"}`. `type` is one of `submission`, `template`, `combined_submission`, `custom_file`, or `url` (use `url` instead of `id`). An optional `template_version` is allowed for templates.",
    },
    password: {
      type: "string",
      label: "Encrypt PDF With Passphrase",
      description: "Passphrase used to encrypt and open the combined PDF.",
      optional: true,
      secret: true,
    },
    expiresIn: {
      type: "integer",
      label: "Expires In (Seconds)",
      description: "Number of seconds until the combined PDF is deleted.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Custom metadata to store with the combined submission, as a JSON object — e.g. `{\"caseId\":\"123\"}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const sourcePdfs = (this.sourcePdfs || []).map((row) => {
      const obj = typeof row === "string" ? JSON.parse(row) : row;
      const entry = { type: obj.type || "submission" };
      if (obj.type === "url") entry.url = obj.url;
      else entry.id = obj.id;
      if (obj.template_version) entry.template_version = obj.template_version;
      return entry;
    });
    const body = { source_pdfs: sourcePdfs };
    if (this.password) body.password = this.password;
    if (this.expiresIn) body.expires_in = this.expiresIn;
    if (this.metadata) body.metadata = this.metadata;

    const response = await this.docspring.combinePdfs({ $, data: body });
    const combined = response.combined_submission || response;
    $.export("$summary", `Combined PDF \`${combined.id}\` (${combined.state})`);
    return combined;
  },
};
