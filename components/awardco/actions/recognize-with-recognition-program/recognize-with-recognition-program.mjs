import { ConfigurationError } from "@pipedream/platform";
import awardco from "../../awardco.app.mjs";
import { omitEmpty } from "../../common/utils.mjs";

export default {
  key: "awardco-recognize-with-recognition-program",
  name: "Recognize With Recognition Program",
  description: "Submit recognition in Awardco, with a recognition program. [See the documentation](https://api.awardco.com/api#tag/recognition/POST/recognize).",
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
    recognitionProgramId: {
      type: "integer",
      label: "Recognition program ID",
      description: "ID of the recognition program",
      optional: true,
    },
    recognitionProgramName: {
      type: "string",
      label: "Recognition program name",
      description: "Name of the recognition program",
      optional: true,
    },
    budgetName: {
      type: "string",
      label: "Budget name",
      description:
        "Required when amount is greater than 0 and the program uses allowable access budgets; may be ignored for central or recipient-based budgets",
    },
    title: {
      type: "string",
      label: "Title",
      description:
        "Optional headline (max 50 characters; only when the program has the title question enabled)",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.recognitionProgramId && !this.recognitionProgramName) {
      throw new ConfigurationError("Recognition program ID or Name is required");
    }
    const response = await this.awardco.recognize({
      $,
      data: omitEmpty({
        recipients: this.recipients,
        note: this.note,
        tagNames: this.tagNames,
        giver: this.giver || undefined,
        amount: this.amount,
        isPublic: this.isPublic,
        recognitionProgramId: this.recognitionProgramId,
        recognitionProgramName: this.recognitionProgramName,
        budgetName: this.budgetName,
        title: this.title || undefined,
      }),
    });

    $.export("$summary", "Successfully submitted recognition with program");
    return response;
  },
};
