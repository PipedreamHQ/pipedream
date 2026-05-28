import { ConfigurationError } from "@pipedream/platform";
import { EMAIL_FORMATS } from "../../common/constants.mjs";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-email-sheet",
  name: "Email Sheet",
  description:
    "Send a sheet as an email attachment to one or more recipients. The sheet can be sent as PDF, Excel, or PDF Gantt format."
    + " Use **List Sheets** to find the sheet ID."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/sheet-send)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    smartsheet,
    sheetId: {
      type: "string",
      label: "Sheet ID",
      description: "The ID of the sheet to email. Use **List Sheets** to find sheet IDs.",
    },
    sendTo: {
      type: "string",
      label: "Send To",
      description:
        "JSON array of recipient objects, each with an `email` field."
        + " Example: `[{\"email\": \"user@example.com\"}, {\"email\": \"other@example.com\"}]`",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject line.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "Optional message body included in the email.",
      optional: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "Attachment format. Defaults to `PDF`.",
      options: EMAIL_FORMATS,
      optional: true,
    },
    ccMe: {
      type: "boolean",
      label: "CC Me",
      description: "Set to `true` to CC the sender on the email.",
      optional: true,
    },
  },
  async run({ $ }) {
    let sendTo;
    try {
      sendTo = JSON.parse(this.sendTo);
    } catch {
      throw new ConfigurationError("`Send To` must be a valid JSON array of objects with an `email` field.");
    }
    if (!Array.isArray(sendTo) || !sendTo.length) {
      throw new ConfigurationError("`Send To` must be a non-empty JSON array of recipient objects.");
    }
    for (const [
      i,
      recipient,
    ] of sendTo.entries()) {
      if (!recipient || typeof recipient !== "object" || typeof recipient.email !== "string" || !recipient.email.trim()) {
        throw new ConfigurationError(`Recipient at index ${i} must be an object with a non-empty \`email\` field.`);
      }
    }

    const data = {
      sendTo,
      subject: this.subject,
    };
    if (this.message) {
      data.message = this.message;
    }
    if (this.format) {
      data.format = this.format;
    }
    if (this.ccMe !== undefined) {
      data.ccMe = this.ccMe;
    }

    const response = await this.smartsheet.emailSheet(this.sheetId, {
      $,
      data,
    });
    $.export("$summary", `Emailed sheet ${this.sheetId} to ${sendTo.length} recipient(s)`);
    return response;
  },
};
