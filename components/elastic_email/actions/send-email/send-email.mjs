import {
  BODY_CONTENT_TYPE_OPTIONS,
  ENCODING_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import app from "../../elastic_email.app.mjs";

export default {
  key: "elastic_email-send-email",
  name: "Send Email",
  description: "Sends an email to one or more recipients. [See the documentation](https://elasticemail.com/developers/api-documentation/rest-api#operation/emailsPost)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "List of recipients",
    },
    from: {
      type: "string",
      label: "From",
      description: "Your e-mail with an optional name (e.g.: email@domain.com)",
    },
    bodyContentType: {
      type: "string",
      label: "Body Content Type",
      description: "Type of body part",
      options: BODY_CONTENT_TYPE_OPTIONS,
      optional: true,
    },
    bodyContent: {
      type: "string",
      label: "Body Content",
      description: "Actual content of the body part",
      optional: true,
    },
    merge: {
      type: "object",
      label: "Merge",
      description: "A key-value collection of custom merge fields, shared between recipients. Should be used in e-mail body like so: {firstname}, {lastname} etc.",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "To what address should the recipients reply to (e.g. email@domain.com)",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Default subject of email.",
      optional: true,
    },
    templateName: {
      propDefinition: [
        app,
        "templateName",
      ],
      optional: true,
    },
    timeOffset: {
      type: "integer",
      label: "Time Offset",
      description: "By how long should an e-mail be delayed (in minutes). Maximum is 35 days.",
      optional: true,
    },
    poolName: {
      type: "string",
      label: "Pool Name",
      description: "Name of your custom IP Pool to be used in the sending process",
      optional: true,
    },
    channelName: {
      type: "string",
      label: "Channel Name",
      description: "Name of selected channel.",
      optional: true,
    },
    encoding: {
      type: "string",
      label: "Encoding",
      description: "Encoding type for the email headers",
      options: ENCODING_OPTIONS,
      optional: true,
    },
    trackOpens: {
      type: "boolean",
      label: "Track Opens",
      description: "Should the opens be tracked? If no value has been provided, Account's default setting will be used.",
      optional: true,
    },
    trackClicks: {
      type: "boolean",
      label: "Track Clicks",
      description: "Should the clicks be tracked? If no value has been provided, Account's default setting will be used.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.sendBulkEmails({
      $,
      data: {
        Recipients: parseObject(this.recipients)?.map((item) => ({
          Email: item,
        })),
        Content: {
          From: this.from,
          Body: [
            {
              ContentType: this.bodyContentType,
              Body: this.bodyContent,
            },
          ],
          Merge: parseObject(this.merge),
          ReplyTo: this.replyTo,
          Subject: this.subject,
          TemplateName: this.templateName,
        },
        Options: {
          TimeOffset: this.timeOffset,
          PoolName: this.poolName,
          ChannelName: this.channelName,
          Encoding: this.encoding,
          TrackOpens: this.trackOpens,
          TrackClicks: this.trackClicks,
        },
      },
    });
    $.export("$summary", `Emails sent successfully to ${this.recipients.join(", ")}`);
    return response;
  },
};
