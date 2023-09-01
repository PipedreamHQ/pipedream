import twilio from "twilio";

export default {
  key: "twilio-get-message",
  name: "Get Message",
  description: "Return details of a message. [See the docs](https://www.twilio.com/docs/sms/api/message-resource#fetch-a-message-resource) for more information",
  version: "0.1.2",
  type: "action",
  props: {
    twilio: {
      type: "app",
      app: "twilio",
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The SID of the Message",
      optional: true,
      async options() {
        const messages = await this.listMessages();
        return messages.map((message) => {
          return {
            label: messageToString(message),
            value: message.sid,
          };
        });
      },
    },
  },
  methods: {
    getClient() {
      // Uncomment this line when users are ready to migrate
      // return twilio(this.$auth.accountSid, this.$auth.authToken);
      return twilio(this.$auth.Sid, this.$auth.Secret, {
        accountSid: this.$auth.AccountSid,
      });
    },
    listMessages(params) {
      const client = this.getClient();
      return client.messages.list(params);
    },
    getMessage(sid) {
      const client = this.getClient();
      return client.messages(sid).fetch();
    },
  },
  async run({ $ }) {
    const resp = await this.getMessage(this.messageId);
    $.export("$summary", `Successfully fetched the message, "${messageToString(resp)}"`);
    return resp;
  },
};

function formatDateString(date) {
  const dateObj = new Date(date);
  return dateObj.toISOString().split("T")[0];
}

function messageToString(message) {
  const MAX_LENGTH = 30;
  const messageText = message.body.length > MAX_LENGTH
    ? `${message.body.slice(0, MAX_LENGTH)}...`
    : message.body; // truncate long text
  const messageDate = message.dateSent || message.dateCreated;
  const dateString = formatDateString(messageDate);
  return `${message.from} to ${message.to} on ${dateString}: ${messageText}`;
}
