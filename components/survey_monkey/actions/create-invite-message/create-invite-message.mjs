import { ConfigurationError } from "@pipedream/platform";
import surveyMonkey from "../../survey_monkey.app.mjs";
import base from "../common/base-survey.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "survey_monkey-create-invite-message",
  name: "Create Invite Message",
  description: "Create an invite message on an email or SMS collector. Add recipients with **Add Message Recipients**, then deliver it with **Send Invite Message**. [See the docs here](https://api.surveymonkey.com/v3/docs?javascript#api-endpoints-post-collectors-id-messages)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...base.props,
    collectorId: {
      propDefinition: [
        surveyMonkey,
        "collectorId",
        (c) => ({
          surveyId: c.survey,
        }),
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of message to create. Use `sms` for SMS collectors and `invite` for email collectors.",
      options: constants.MESSAGE_TYPES,
      default: "invite",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject line of the email message. Not used for SMS messages.",
      optional: true,
    },
    bodyText: {
      type: "string",
      label: "Body Text",
      description: "The plain text body of the message. Per SurveyMonkey's Anti-Spam Policy the opt-out link must stay visible and its purpose clearly explained.",
      optional: true,
    },
    bodyHtml: {
      type: "string",
      label: "Body HTML",
      description: "The HTML body of an email message.",
      optional: true,
    },
    fromMessageId: {
      propDefinition: [
        surveyMonkey,
        "messageId",
        (c) => ({
          collectorId: c.collectorId,
        }),
      ],
      label: "Copy From Message",
      description: "Copy the new message from an existing message on this collector, e.g. to reuse a template. Alternatively, provide a custom *Message ID*.",
      optional: true,
    },
    fromCollectorId: {
      type: "string",
      label: "Copy From Collector ID",
      description: "Copy the message from the most recent message on another collector.",
      optional: true,
    },
    includeRecipients: {
      type: "boolean",
      label: "Include Recipients",
      description: "Whether to copy the recipients of the message being copied from.",
      optional: true,
    },
    recipientStatus: {
      type: "string",
      label: "Recipient Status",
      description: "Filter which recipients of the copied message to include.",
      options: [
        "reminder",
        "thank_you",
      ],
      optional: true,
    },
    embedFirstQuestion: {
      type: "boolean",
      label: "Embed First Question",
      description: "Whether to embed the survey's first question in an email invitation.",
      optional: true,
    },
    isBrandingEnabled: {
      type: "boolean",
      label: "Is Branding Enabled",
      description: "Whether SurveyMonkey branding is shown in the message.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      type, subject, bodyText, bodyHtml, fromMessageId, fromCollectorId,
    } = this;

    if (!bodyText && !bodyHtml && !fromMessageId && !fromCollectorId) {
      throw new ConfigurationError("Set **Body Text** or **Body HTML**, or copy an existing message with **Copy From Message** or **Copy From Collector ID**.");
    }

    const response = await this.surveyMonkey.createMessage({
      $,
      collectorId: this.collectorId,
      data: {
        type,
        subject,
        body_text: bodyText,
        body_html: bodyHtml,
        from_message_id: fromMessageId,
        from_collector_id: fromCollectorId,
        include_recipients: this.includeRecipients,
        recipient_status: this.recipientStatus,
        embed_first_question: this.embedFirstQuestion,
        is_branding_enabled: this.isBrandingEnabled,
      },
    });

    $.export("$summary", `Successfully created ${type} message #${response.id}`);
    return response;
  },
};
