const bandwidthMessaging = require("@bandwidth/messaging");

module.exports = {
  type: "app",
  app: "bandwidth",
  propDefinitions: {
    messageTo: {
      type: "string",
      label: "To",
      description: "The number the message will be sent to, in E164 format ex `+19195551234`",
    },
    from: {
      type: "string",
      label: "From",
      description: "The number the call or message event will come from, in E164 format ex `+19195551234`",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The text message content",
    },
    messagingApplicationId: {
      type: "string",
      label: "Messaging Application ID",
      description: "The ID from the messaging application created in the [Bandwidth Dashboard](https://dashboard.bandwidth.com).\n\nThe application must be associated with the location that the `from` number lives on.",
    },
    mediaUrl: {
      type: "string[]",
      label: "Media URL",
      description: "Publicly addressable URL of the media you would like to send with the SMS",
    },
  },
  methods: {
    getMessagingClient() {
      return new bandwidthMessaging.Client({
        basicAuthUserName: this.$auth.username,
        basicAuthPassword: this.$auth.password,
      });
    },
    async sendSms(to, from, message, messagingApplicationId) {
      const controller = new bandwidthMessaging.ApiController(this.getMessagingClient());
      const data = {
        applicationId: messagingApplicationId,
        to: [
          to,
        ],
        from: from,
        text: message,
      };
      return await controller.createMessage(this.$auth.accountId, data);
    },
  },
};
