import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "infobip-send-sms-v3",
  name: "Send SMS (OpenAPI v3)",
  description: "Sends an SMS message using the latest Infobip v3 API with automatic OpenAPI method generation. [See the documentation](https://api.infobip.com/platform/1/openapi/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip,
    sender: {
      propDefinition: [
        infobip,
        "sender",
      ],
      description: "The sender ID which can be alphanumeric or numeric (e.g., CompanyName). Make sure you don't exceed character limit.",
    },
    destinations: {
      type: "string[]",
      label: "Phone Numbers",
      description: "Array of destination phone numbers in international format (e.g., ['41793026727', '41793026834'])",
    },
    messageText: {
      propDefinition: [
        infobip,
        "messageText",
      ],
    },
    flash: {
      type: "boolean",
      label: "Flash SMS",
      description: "Allows for sending a flash SMS to automatically appear on recipient devices without interaction.",
      optional: true,
    },
    transliteration: {
      type: "string",
      label: "Transliteration",
      description: "Transliteration of the message content.",
      options: [
        "TURKISH",
        "GREEK", 
        "CYRILLIC",
        "SERBIAN_CYRILLIC",
        "BULGARIAN_CYRILLIC",
        "CENTRAL_EUROPEAN",
        "BALTIC",
        "NON_UNICODE"
      ],
      optional: true,
    },
    languageCode: {
      type: "string", 
      label: "Language Code",
      description: "Language code for the message (e.g., TR, EN, ES).",
      optional: true,
    },
    notifyUrl: {
      type: "string",
      label: "Delivery Report URL",
      description: "The URL on your callback server to which a delivery report will be sent.",
      optional: true,
    },
    callbackData: {
      type: "string",
      label: "Callback Data",
      description: "Additional data to be sent back in delivery reports.",
      optional: true,
    },
    validityPeriod: {
      type: "integer",
      label: "Validity Period (hours)",
      description: "The message validity period in hours (1-720).",
      optional: true,
      min: 1,
      max: 720,
    },
    campaignReferenceId: {
      type: "string",
      label: "Campaign Reference ID",
      description: "Campaign reference ID for tracking purposes.",
      optional: true,
    },
    entityId: {
      propDefinition: [
        infobip,
        "entityId",
      ],
      optional: true,
    },
    applicationId: {
      propDefinition: [
        infobip,
        "applicationId", 
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      infobip,
      sender,
      destinations,
      messageText,
      flash,
      transliteration,
      languageCode,
      notifyUrl,
      callbackData,
      validityPeriod,
      campaignReferenceId,
      entityId,
      applicationId,
    } = this;

    // Debug: Show available OpenAPI methods
    console.log("🔍 Fetching available OpenAPI methods...");
    const availableMethods = await infobip.debugAvailableMethods();

    // Prepare message content
    const content = {
      text: messageText,
    };

    if (transliteration) {
      content.transliteration = transliteration;
    }

    if (languageCode) {
      content.language = {
        languageCode: languageCode,
      };
    }

    // Prepare message options
    const options = {};
    
    if (flash) {
      options.flash = flash;
    }

    if (validityPeriod) {
      options.validityPeriod = {
        amount: validityPeriod,
        timeUnit: "HOURS",
      };
    }

    if (campaignReferenceId) {
      options.campaignReferenceId = campaignReferenceId;
    }

    // Prepare webhooks
    const webhooks = {};
    if (notifyUrl) {
      webhooks.delivery = {
        url: notifyUrl,
        intermediateReport: true,
      };
      webhooks.contentType = "application/json";
      
      if (callbackData) {
        webhooks.callbackData = callbackData;
      }
    }

    // Prepare platform information
    const platform = {};
    if (entityId) platform.entityId = entityId;
    if (applicationId) platform.applicationId = applicationId;

    // Prepare destinations array
    const destinationsArray = Array.isArray(destinations) 
      ? destinations.map(to => ({ to: to.toString() }))
      : [{ to: destinations.toString() }];

    // Build the request payload using the v3 API format
    const requestBody = {
      messages: [
        {
          sender,
          destinations: destinationsArray,
          content,
          ...(Object.keys(options).length > 0 && { options }),
          ...(Object.keys(webhooks).length > 0 && { webhooks }),
          ...(Object.keys(platform).length > 0 && { platform }),
        },
      ],
    };

    console.log("📤 Sending SMS using OpenAPI v3 endpoint...");
    console.log("Request payload:", JSON.stringify(requestBody, null, 2));

    try {
      // Use the dynamically generated OpenAPI method
      const response = await infobip.sendSmsMessage({
        $,
        data: requestBody,
      });

      console.log("✅ SMS sent successfully!");
      
      if (response.messages && response.messages.length > 0) {
        const firstMessage = response.messages[0];
        const summary = `SMS sent to ${destinationsArray.length} recipient(s). Status: ${firstMessage.status?.description || 'Unknown'}`;
        $.export("$summary", summary);
        
        // Export useful data
        $.export("messageId", firstMessage.messageId);
        $.export("messageCount", response.messages.length);
        $.export("bulkId", response.bulkId);
        
        console.log(`📨 Message ID: ${firstMessage.messageId}`);
        console.log(`📊 Status: ${firstMessage.status?.description} (${firstMessage.status?.groupName})`);
        
        if (firstMessage.status?.groupId === 1) {
          console.log("🎉 Message accepted for delivery!");
        } else {
          console.warn("⚠️ Message may have issues - check status details");
        }
      }

      return response;

    } catch (error) {
      console.error("❌ Failed to send SMS:", error.message);
      
      if (error.response?.data) {
        console.error("API Error Details:", JSON.stringify(error.response.data, null, 2));
        throw new Error(`SMS sending failed: ${error.response.data.requestError?.serviceException?.text || error.message}`);
      }
      
      throw error;
    }
  },
};
