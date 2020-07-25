module.exports = {
  type: "app",
  app: "twilio",
  propDefinitions: {
    incomingPhoneNumber: {
      type: "string",
      label: "Incoming Phone Number",
      description: "The Twilio phone number where you'll receive messages",
      async options() {
        return await this.listIncomingPhoneNumbers();
      },
    },
  },
  methods: {
    getClient() {
      // return twilio
    },
    async listIncomingPhoneNumbers() {
      const client = this.getClient();

      const numbers = [
        {
          label: "+14154184068",
          value: "+14154184068",
        },
      ];
      return numbers;
    },
  },
};
