import fs from "fs";
import faxtofax from "../../faxtofax.app.mjs";

export default {
  key: "faxtofax-send-fax",
  name: "Send Fax",
  description: "Send a fax to one recipient. Provide a file, plain text, or both. [See the documentation](https://faxtofax.com/integrations/mcp)",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: true, openWorldHint: true, readOnlyHint: false },
  props: {
    faxtofax,
    to: {
      type: "string",
      label: "To",
      description: "The recipient's fax number, e.g. `+14165551234`. 10-digit numbers are read as US/Canada.",
    },
    fromNumber: { propDefinition: [faxtofax, "fromNumber"] },
    recipientName: {
      type: "string",
      label: "Recipient Name",
      description: "Shown on the cover page.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "A file in `/tmp` (e.g. `/tmp/referral.pdf`) or a public `https://` URL. PDF, Word, Excel, PowerPoint, images, TXT, HTML or RTF, up to 10 MB.",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "Plain text to fax, laid out on pages for you.",
      optional: true,
    },
    coverNote: {
      type: "string",
      label: "Cover Note",
      description: "Adds a cover page with this message.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.filePath && !this.text && !this.coverNote) {
      throw new Error("Add a File Path or URL, Text, or a Cover Note.");
    }
    const args = {
      to: this.to,
      from_number: this.fromNumber,
      recipient_name: this.recipientName,
      subject: this.subject,
      document_text: this.text,
      cover_note: this.coverNote,
    };
    if (this.filePath?.startsWith("https://")) {
      const name = decodeURIComponent(new URL(this.filePath).pathname.split("/").pop() || "document.pdf");
      args.document_file = { download_url: this.filePath, file_id: "pipedream", file_name: name };
    } else if (this.filePath) {
      const path = this.filePath.startsWith("/tmp") ? this.filePath : `/tmp/${this.filePath}`;
      args.document_base64 = fs.readFileSync(path).toString("base64");
      args.document_filename = path.split("/").pop();
    }
    const response = await this.faxtofax.sendFax({ $, args });
    $.export("$summary", `Fax queued to ${response.to} (${response.pages} page${response.pages === 1 ? "" : "s"})`);
    return response;
  },
};
