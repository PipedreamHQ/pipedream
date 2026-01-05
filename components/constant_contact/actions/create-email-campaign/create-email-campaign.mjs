import { parseObject } from "../../common/utils.mjs";
import constantContact from "../../constant_contact.app.mjs";

export default {
  key: "constant_contact-create-email-campaign",
  name: "Create Email Campaign",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new email campaign. [See the documentation](https://developer.constantcontact.com/api_reference/index.html#tag/Email-Campaigns/operation/createEmailCampaignUsingPOST)",
  type: "action",
  props: {
    constantContact,
    name: {
      type: "string",
      label: "Name",
      description: "The unique and descriptive name that you specify for the email campaign",
    },
    emailCampaignActivities: {
      type: "string[]",
      label: "Email Campaign Activities",
      description: "Array of objects that describe the email campaign activities for the email campaign. **Example: [{ \"format_type\": 5, \"from_name\": \"Name Test\", \"subject\": \"Test Email\", \"from_email\": \"test@example.com\", \"reply_to_email\": \"test@example.com\", \"html_content\": \"<html><body>Hello, world!</body></html>\" }]** [See the documentation](https://developer.constantcontact.com/api_reference/index.html#tag/Email-Campaigns/operation/createEmailCampaignUsingPOST) for more information",
    },
  },
  async run({ $ }) {
    const response = await this.constantContact.createEmailCampaign({
      $,
      data: {
        name: this.name,
        email_campaign_activities: parseObject(this.emailCampaignActivities),
      },
    });

    $.export("$summary", `Successfully created email campaign with ID \`${response.campaign_id}\``);
    return response;
  },
};

