import awardco from "../../awardco.app.mjs";
import { omitEmpty } from "../../common/utils.mjs";

export default {
  key: "awardco-recognize-without-recognition-program",
  name: "Recognize Without Recognition Program",
  description: "Submit recognition in Awardco, without a recognition program. [See the documentation](https://api.awardco.com/api#tag/recognition/POST/recognize/no-program).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    awardco,
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "Employee IDs, emails, or usernames of people to recognize (at least one)",
    },
    note: {
      type: "string",
      label: "Note",
      description: "Short note describing why the user(s) are being recognized",
    },
    tagNames: {
      type: "string[]",
      label: "Tag names",
      description: "Optional tags to attach to the recognition",
      optional: true,
    },
    giver: {
      type: "string",
      label: "Giver",
      description:
        "Who is giving the recognition; leave empty to use the company recognition bot",
      optional: true,
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "Cash value of the recognition in the company base currency (0 if none)",
      default: 0,
      optional: true,
    },
    isPublic: {
      type: "boolean",
      label: "Public",
      description: "Whether the recognition appears as public in the feed",
      default: true,
      optional: true,
    },
    emailTemplateName: {
      type: "string",
      label: "Email template name",
      description: "Recognition email template name (optional if send notifications is false)",
      optional: true,
    },
    sendNotifications: {
      type: "boolean",
      label: "Send notifications",
      description: "Whether to email recipients about the recognition",
      default: false,
      optional: true,
    },
    budgetName: {
      type: "string",
      label: "Budget name",
      description: "Budget to use when rewarding (see API docs for access rules)",
    },
  },
  async run({ $ }) {
    const response = await this.awardco.recognizeNoProgram({
      $,
      data: omitEmpty({
        recipients: this.recipients,
        note: this.note,
        tagNames: this.tagNames,
        giver: this.giver || undefined,
        amount: this.amount,
        isPublic: this.isPublic,
        emailTemplateName: this.emailTemplateName,
        sendNotifications: this.sendNotifications,
        budgetName: this.budgetName,
      }),
    });

    $.export("$summary", "Successfully submitted recognition without program");
    return response;
  },
};
