import { parseObject } from "../../common/utils.mjs";
import app from "../../msg91.app.mjs";

export default {
  key: "msg91-send-sms",
  name: "Send SMS",
  description: "Send SMS messages to one or multiple recipients. [See the documentation](https://docs.msg91.com/sms/send-sms)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to use for the SMS",
    },
    shortUrl: {
      type: "boolean",
      label: "Short URL",
      description: "If set to true, the URL will be shortened using the MSG91 URL shortener",
      default: false,
    },
    shortUrlExpiry: {
      type: "integer",
      label: "Short URL Expiry",
      description: "The expiry time for the short URL in seconds",
      optional: true,
    },
    realTimeResponse: {
      type: "boolean",
      label: "Real Time Response",
      description: "If set to true, the response will be returned immediately",
      optional: true,
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "An array of objects containing the recipient details. Example: `[{\"mobiles\": \"919999999999\", \"VAR1\": \"VALUE 1\", \"VAR 2\": \"VALUE 2\"}]`",
    },
  },
  async run({ $ }) {
    const response = await this.app.sendSMS({
      $,
      data: {
        template_id: this.templateId,
        short_url: +this.shortUrl,
        short_url_expiry: this.shortUrlExpiry,
        realTimeResponse: this.realTimeResponse,
        recipients: parseObject(this.recipients),
      },
    });
    $.export("$summary", `Successfully sent SMS to ${this.recipients.length} recipient(s)`);
    return response;
  },
};
