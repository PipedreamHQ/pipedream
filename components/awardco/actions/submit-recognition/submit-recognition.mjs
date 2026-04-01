import { ConfigurationError } from "@pipedream/platform";
import awardco from "../../awardco.app.mjs";
import constants from "../../common/constants.mjs";
import { omitEmpty } from "../../common/utils.mjs";

export default {
  key: "awardco-submit-recognition",
  name: "Submit Recognition",
  description:
    "Submit recognition in Awardco, with or without a recognition program. [See the documentation](https://api.awardco.com/api#tag/recognition).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    awardco,
    recognitionMode: {
      type: "string",
      label: "Recognition mode",
      description: "Create recognition with or without a recognition program",
      options: constants.RECOGNITION_MODES,
      reloadProps: true,
    },
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
  },
  async additionalProps() {
    if (this.recognitionMode === "with_program") {
      return {
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
      };
    }
    if (this.recognitionMode === "no_program") {
      return {
        emailTemplateName: {
          type: "string",
          label: "Email template name",
          description: "Recognition email template name (optional if send notifications is true)",
          optional: true,
        },
        sendNotifications: {
          type: "boolean",
          label: "Send notifications",
          description: "Whether to email recipients about the recognition",
          default: true,
          optional: true,
        },
        budgetName: {
          type: "string",
          label: "Budget name",
          description: "Budget to use when rewarding (see API docs for access rules)",
        },
      };
    }
    return {};
  },
  async run({ $ }) {
    let response;
    let summary;

    let data = {
      recipients: this.recipients,
      note: this.note,
      tagNames: this.tagNames,
      giver: this.giver || undefined,
      amount: this.amount,
      isPublic: this.isPublic,
    };

    if (this.recognitionMode === "with_program") {
      if (!this.recognitionProgramId && !this.recognitionProgramName) {
        throw new ConfigurationError("Recognition program ID or Name is required");
      }
      response = await this.awardco.recognize({
        $,
        data: omitEmpty({
          ...data,
          recognitionProgramId: this.recognitionProgramId,
          recognitionProgramName: this.recognitionProgramName,
          budgetName: this.budgetName,
          title: this.title || undefined,
        }),
      });
      summary = "Successfully submitted recognition with program";
      return response;
    }

    if (this.recognitionMode === "no_program") {
      response = await this.awardco.recognizeNoProgram({
        $,
        data: omitEmpty({
          emailTemplateName: this.emailTemplateName,
          sendNotifications: this.sendNotifications,
          budgetName: this.budgetName,
        }),
      });
      summary = "Successfully submitted recognition without program";
    }

    $.export("$summary", summary);
    return response;
  },
};
