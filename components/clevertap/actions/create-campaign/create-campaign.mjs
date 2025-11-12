import app from "../../clevertap.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "clevertap-create-campaign",
  name: "Create Campaign",
  description: "Create a campaign. [See the documentation](https://developer.clevertap.com/docs/create-campaign-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Campaign Name",
      description: "The name of your campaign shown in the CleverTap dashboard.",
    },
    targetMode: {
      type: "string",
      label: "Target Mode",
      description: "The type of campaign to create",
      reloadProps: true,
      options: [
        {
          label: "Web Push Notification",
          value: "webpush",
        },
        {
          label: "Mobile Push Notification",
          value: "push",
        },
        {
          label: "Email",
          value: "email",
        },
        {
          label: "Webhooks",
          value: "webhook",
        },
      ],
    },
    where: {
      type: "object",
      label: "Where",
      optional: true,
      description: `Allows you to filter target base on the user events and profile properties. Omit this parameter to target your entire user base. **Example:**
\`\`\`
{
  "event_name": "Charged",
  "from": 20250101,
  "to": 20250402
}
\`\`\``,
    },
    content: {
      type: "object",
      label: "Content",
      description: `Object that defines the content for your message. **Web Push Notification Example:**
\`\`\`
{
  "title": "Hi!",
  "body": "How are you doing today?",
  "platform_specific": {
    "safari": {
      "deep_link": "https://www.google.com",
      "ttl": 10
    },
    "chrome": {
      "image": "https://www.exampleImage.com",
      "icon": "https://www.exampleIcon.com",
      "deep_link": "http://www.example.com",
      "ttl": 10,
      "require_interaction": true,
      "cta_title1": "title",
      "cta_link1": "http://www.example2.com",
      "cta_iconlink1": "https://www.exampleIcon2.com"
    },
    "firefox": {
      "icon": "https://www.exampleIcon.com",
      "deep_link": "https://www.google.com",
      "ttl": 10
    },
    "kaios": {
      "icon": "https://www.exampleIcon.com",
      "ttl": 10,
      "kaiosKV": {
        "key1": "value1",
        "key2": "value2"
      }
    }
  }
}
\`\`\`\n\n**Mobile Push Notification Example:**
\`\`\`
{
  "title": "Hi!",
  "body": "How are you doing today?",
  "platform_specific": {
    "ios": {
      "mutable-content": "true", 
      "deep_link": "example.com",
      "sound_file": "example.caf",
      "category": "application category//Books",
      "badge_count": 1,
      "Key": "Value_ios"
    },
    "android": {
      "enable_rendermax": true,
      "wzrk_cid": "Marketing",
      "background_image": "http://example.jpg",
      "default_sound": true,
      "deep_link": "example.com",
      "large_icon": "http://example.png",
      "Key": "Value_android",
    }
  }
}
\`\`\`\n\n **Email Example:**
\`\`\`
{
  "subject": "Welcome",
  "body": "<div>Your HTML content for the email</div>",
  "sender_name": "CleverTap"
}
\`\`\``,
      optional: true,
    },
    respectFrequencyCaps: {
      type: "boolean",
      label: "Respect Frequency Caps",
      description: "Set to `false` if you want to override frequency caps and dwell time. Defaults to `true`.",
      optional: true,
    },
    estimateOnly: {
      type: "boolean",
      label: "Estimate Only",
      description: "If this parameter is set to `true`, the request returns an estimated reach of the campaign, which is the number of users who receive the notification when you send it out. Setting this parameter to `true` does not create the campaign. Defaults to `false`.",
      optional: true,
    },
    conversionGoal: {
      type: "object",
      label: "Conversion Goal",
      optional: true,
      description: `Checks the end goal of the campaign for conversion tracking. **Example:**
\`\`\`
{
  "event_name": "Charged",
  "filter_type": {
    "event_property": [
      {
        "property_name": "Items|Book name",
        "operator": "equals",
        "property_value": "book name"
      },
      {
        "property_name": "Amount",
        "operator": "equals",
        "property_value": 3456
      },
      {
        "property_name": "Currency",
        "operator": "equals",
        "property_value": "USD"
      }
    ],
    "first_time": "yes",
    "last_time": "yes",
    "time_of_day": [["21:00","23:00"],["11:34","12:44"],["13:01","13:40"]],
    "day_of_week": [1,7],
    "day_of_month": [1,3,16,31]
  },
  "conversion_time": "1D",
  "revenue_property": "Amount"
}
\`\`\``,
    },
    ttlType: {
      type: "string",
      label: "Time To Live Type",
      description: "This allows setting of time to live for push notifications for android and iOS. The type of time to live. Can be `absolute` or `relative`. Defaults to `absolute`.",
      options: [
        {
          label: "Absolute",
          value: "absolute",
        },
        {
          label: "Relative",
          value: "relative",
        },
      ],
      optional: true,
    },
    ttlValue: {
      type: "integer",
      label: "Time To Live Value",
      description: "This allows setting of time to live for push notifications for android and iOS. The value of the time to live. Can be a number of days, hours, minutes, or seconds.\n- For `relative` ttl, the input is an integer in minutes\n- For `absolute` ttl, the input should be an integer in the `yyyyMMddHHmm` format. Example: `202207200000`",
      optional: true,
    },
    webhookEndpointName: {
      type: "string",
      label: "Webhook Endpoint Name",
      description: "The name of the webhook endpoint to use for the campaign.",
      optional: true,
    },
    webhookFields: {
      type: "string[]",
      label: "Webhook Fields",
      description: "The fields to include in the webhook payload. Can be `profile-attributes`, `tokens`, or `identities`.",
      optional: true,
    },
    webhookKeyValue: {
      type: "object",
      label: "Webhook Key Value",
      description: "The key-value pairs to include in the webhook payload.",
      optional: true,
    },
  },
  additionalProps() {
    if (this.targetMode === "push") {
      return {
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
        },
      };
    }

    return {
      when: {
        type: "string",
        label: "When",
        description: "When you want to send out the messages. Valid inputs are `now` (to send the notification right away) or in the format **YYYYMMDD HH:MM** to schedule the messages for a specific date and time in the future. **Example:** `20250717 15:20`",
      },
    };
  },
  async run({ $ }) {
    const {
      app,
      name,
      targetMode,
      when,
      where,
      content,
      respectFrequencyCaps,
      estimateOnly,
      conversionGoal,
      ttlType,
      ttlValue,
      webhookEndpointName,
      webhookFields,
      webhookKeyValue,
    } = this;

    const response = await app.createCampaign({
      $,
      data: {
        name,
        target_mode: targetMode,
        respect_frequency_caps: respectFrequencyCaps,
        estimate_only: estimateOnly,
        when: utils.parseJson(when) || {},
        where: utils.parseJson(where) || {},
        content: utils.parseJson(content) || {},
        ...(conversionGoal
          ? {
            conversion_goal: utils.parseJson(conversionGoal),
          }
          : {}
        ),
        ...(ttlType && ttlValue
          ? {
            ttl: {
              ttl_type: ttlType,
              value: ttlValue,
            },
          }
          : {}
        ),
        ...(webhookEndpointName
          ? {
            webhook_endpoint_name: webhookEndpointName,
          }
          : {}
        ),
        ...(webhookFields
          ? {
            webhook_fields: utils.parseJson(webhookFields),
          }
          : {}
        ),
        ...(webhookKeyValue
          ? {
            webhook_key_value: utils.parseJson(webhookKeyValue),
          }
          : {}
        ),
      },
    });

    $.export("$summary", "Successfully created campaign");

    return response;
  },
};
