import { ConfigurationError } from "@pipedream/platform";
import surveyMonkey from "../../survey_monkey.app.mjs";
import base from "../common/base-survey.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "survey_monkey-create-invite-message",
  name: "Create Invite Message",
  description: "Create an invite message on an email or SMS collector. Add recipients with **Add Message Recipients**, then deliver it with **Send Invite Message**. [See the documentation](https://api.surveymonkey.com/v3/docs?javascript#api-endpoints-post-collectors-collector_id-messages)",
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
      description: "The plain text body of the message, and the only body an SMS message can use. SurveyMonkey advises keeping an SMS body to 30 characters or fewer, including spaces, so the invitation stays a single text. Include the `[SurveyLink]` placeholder, or recipients get an invitation with no way to reach the survey. Per SurveyMonkey's Anti-Spam Policy the `[OptOutLink]` must stay visible and its purpose clearly explained.",
      optional: true,
    },
    bodyHtml: {
      type: "string",
      label: "Body HTML",
      description: "The HTML body of an email message, and email-only — it does not apply to `sms` messages, and it overrides **Body Text** when both are set. The same placeholders apply as for **Body Text** — `[SurveyLink]`, `[OptOutLink]`, `[PrivacyLink]` and `[FooterLink]` — and the Anti-Spam Policy requires that the opt-out link stay visible rather than being hidden in the markup.",
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
      description: "The set of recipients to send to.",
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

    const isCopy = !!(fromMessageId || fromCollectorId);

    // `body_html` is documented as the HTML body of the *email* message, so it
    // cannot carry an SMS's content — accepting it alone for `sms` would send a
    // message with nothing in it.
    if (!isCopy && type === "sms" && !bodyText) {
      throw new ConfigurationError("An SMS message needs **Body Text** — **Body HTML** applies to email messages only. Alternatively, copy an existing message with **Copy From Message** or **Copy From Collector ID**.");
    }

    if (!isCopy && type !== "sms" && !bodyText && !bodyHtml) {
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

    $.export("$summary", `Successfully created ${type} message${response.subject
      ? ` "${response.subject}"`
      : ` #${response.id}`}`);
    return response;
  },
};
