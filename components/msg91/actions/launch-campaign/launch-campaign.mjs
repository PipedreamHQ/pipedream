import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import app from "../../msg91.app.mjs";

export default {
  key: "msg91-launch-campaign",
  name: "Launch Campaign",
  description: "Launch a campaign using various communication channels (SMS, Email, WhatsApp, Voice, RCS). [See the documentation](https://docs.msg91.com/campaign/run-campaign)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    campaignSlug: {
      type: "string",
      label: "Campaign Slug",
      description: "The unique identifier (slug) for the campaign to launch",
    },
    to: {
      type: "string[]",
      label: "To",
      description: "An array of objects containing the recipients of the campaign. Example: `[{\"name\": \"name\", \"email\": \"name@email.com\", \"mobiles\": \"919XXXXXXXXX\", \"variables\": { \"name\": { \"type\": \"your_type\", \"value\": \"your_value\" }, \"email\": { \"type\": \"text\", \"value\": \"john.doe@example.com\" } }}]`",
    },
    cc: {
      type: "string[]",
      label: "CC",
      description: "An array of objects containing the CC recipients of the campaign. Example: `[{\"name\": \"name\", \"email\": \"name@email.com\" }]`",
      optional: true,
    },
    bcc: {
      type: "string[]",
      label: "BCC",
      description: "An array of objects containing the BCC recipients of the campaign. Example: `[{\"name\": \"name\", \"email\": \"name@email.com\" }]`",
      optional: true,
    },
    replyTo: {
      type: "string[]",
      label: "Reply To",
      description: "An array of objects containing the BCC recipients of the campaign. Example: `[{\"name\": \"name\", \"email\": \"name@email.com\" }]`",
      optional: true,
    },
    variables: {
      type: "string[]",
      label: "Variables",
      description: "An object containing the variables for the campaign. Example: `{\"name\": { \"type\": \"your_type\", \"value\": \"your_value\"} }`",
      optional: true,
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "An array of objects containing the attachments of the campaign. Example: `[{\"fileType\": \"url or base64\", \"fileName\": \"your_filename\", \"file\": \"your_file\" }]`",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.app.launchCampaign({
        $,
        campaignSlug: this.campaignSlug,
        data: {
          data: {
            sendTo: [
              {
                to: parseObject(this.to),
                cc: parseObject(this.cc),
                bcc: parseObject(this.bcc),
                variables: parseObject(this.variables),
              },
            ],
            reply_to: parseObject(this.replyTo),
            attachments: parseObject(this.attachments),
          },
        },
      });

      $.export("$summary", `Successfully queued campaign: ${this.campaignSlug}`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response.data.errors[0]);
    }
  },
};
