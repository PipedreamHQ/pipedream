import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sms_messages",
  propDefinitions: {
    message: {
      type: "string",
      label: "Message",
      description: "The message to send",
    },
    numbers: {
      type: "string[]",
      label: "Numbers",
      description: "An array of phone numbers to send the message to. Phone numbers should be entered in international format (i.e. + followed by country code)",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The delivery receipt email. An email will be sent to the given address whenever the operator notifies any change in the state of the SMS.",
    },
  },
  methods: {
    getUser() {
      return this.$auth.username;
    },
    sendSMS({
      $ = this, data = {},
    }) {
      return axios($, {
        url: "https://api.lleida.net/sms/v2/",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Accept": "application/json",
          "Authorization": `x-api-key ${this.$auth.api_key}`,
        },
        data,
      });
    },
  },
};
