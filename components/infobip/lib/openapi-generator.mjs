// Enhanced OpenAPI generator for Infobip API
export default class InfobipOpenAPIGenerator {
  constructor(app) {
    this.app = app;
  }

  async generateMethods() {
    // Return sample methods for testing enhanced JSDoc generation
    const methods = {
      sendSmsMessages: {
        path: "/sms/3/messages",
        method: "POST",
        operation: {
          summary: "Send SMS message",
          description: "With this API method, you can do anything from sending a basic message to one person, all the way to sending customized messages to thousands of recipients in one go. It comes with a range of useful features like transliteration, scheduling, and tracking in a unified way.",
          externalDocs: {
            url: "https://www.infobip.com/docs/sms",
          },
        },
      },
      getOutboundSmsMessageDeliveryReports: {
        path: "/sms/1/reports",
        method: "GET",
        operation: {
          summary: "Get outbound SMS message delivery reports",
          description: "If you are for any reason unable to receive real-time delivery reports on your endpoint, you can use this API method to learn if and when the message has been delivered to the recipient.",
          externalDocs: {
            url: "https://www.infobip.com/docs/sms",
          },
        },
      },
      rescheduleSmsMessages: {
        path: "/sms/1/bulks",
        method: "PUT",
        operation: {
          summary: "Reschedule SMS messages",
          description: "Change the date and time of already scheduled messages. To schedule a message, use the sendAt field when sending a message.",
          externalDocs: {
            url: "https://www.infobip.com/docs/sms",
          },
        },
      },
      updateScheduledSmsMessagesStatus: {
        path: "/sms/1/bulks/status",
        method: "PUT",
        operation: {
          summary: "Update scheduled SMS messages status",
          description: "Change the status or completely cancel sending of scheduled messages. To schedule a message, use the sendAt field when sending a message.",
          externalDocs: {
            url: "https://www.infobip.com/docs/sms",
          },
        },
      },
      logEndTag: {
        path: "/ct/1/log/end/{messageId}",
        method: "POST",
        operation: {
          summary: "Confirm conversion",
          description: "Use this endpoint to inform the Infobip platform about the successful conversion on your side. Infobip will use this information to monitor SMS performance and provide you with better service.",
        },
      },
    };

    return {
      methods,
    };
  }

  async generateAllActions() {
    // Return minimal test data for testing the action generation
    return [
      {
        actionKey: "infobip-send-test-sms",
        actionName: "Send Test SMS",
        methodName: "sendSms",
        path: "/sms/2/text/advanced",
        method: "POST",
        operation: {
          summary: "Send Test SMS",
          description: "Test SMS sending action for validation",
          externalDocs: {
            url: "https://www.infobip.com/docs/sms",
          },
        },
      },
    ];
  }
}
