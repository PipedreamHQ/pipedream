import app from "../../clevertap.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "clevertap-create-campaign",
  name: "Create Campaign",
  description: "Create a campaign. [See the documentation](https://developer.clevertap.com/docs/create-campaign-api)",
  version: "0.0.8",
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Campaign Name",
      description: "The name of your campaign shown in the CleverTap dashboard.",
    },
    providerNickName: {
      type: "string",
      label: "Provider Nickname",
      description: "Allows you to specify which vendor/provider to use for your campaign. Required for WhatsApp and SMS.",
    },
    where: {
      type: "object",
      label: "Where",
      description: `Allows you to filter target base on the user events and profile properties. Send an empty object ({}) to target your entire user base. **Example:**
\`\`\`
{
  "event_name": "Charged",
  "from": 20171001,
  "to": 20171220,
  "common_profile_properties": {
    "profile_fields": [
      {
        "property_name": "Country",
        "operator": "equals",
        "property_value": "US"
      }
    ]
  }
}
\`\`\``,
      optional: true,
    },
    contentSubject: {
      type: "string",
      label: "Content Subject",
      description: "The subject line of your email.",
      optional: true,
    },
    contentBody: {
      type: "string",
      label: "Content Body",
      description: "The body of your message. Can be plain text or HTML for emails.",
      optional: true,
    },
    contentSenderName: {
      type: "string",
      label: "Content Sender Name",
      description: "The sender name for your email.",
      optional: true,
    },
    when: {
      type: "object",
      label: "When",
      description: `Allows you to set Date, time and Delivery preferences of the message. **Example:**
\`\`\`
{
  "type": "later",
  "delivery_date_time": ["20230503 15:20"],
  "delivery_timezone": "user",
  "user_timezone_wrap_around": true,
  "dnd": {
    "message_state": "delay",
    "dnd_timezone": "user"
  },
  "campaign_cutoff": "14:20"
}
\`\`\``,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      name,
      providerNickName,
      when,
      where,
      contentSubject,
      contentBody,
      contentSenderName,
    } = this;

    const response = await app.createCampaign({
      $,
      data: {
        name,
        provider_nick_name: providerNickName,
        when: utils.parseJson(when) || {},
        where: utils.parseJson(where) || {},
        ...(
          contentSubject
          || contentBody
          || contentSenderName
            ? {
              content: {
                subject: contentSubject,
                body: contentBody,
                sender_name: contentSenderName,
              },
            }
            : {}
        ),
      },
    });

    $.export("$summary", "Successfully created campaign");

    return response;
  },
};
