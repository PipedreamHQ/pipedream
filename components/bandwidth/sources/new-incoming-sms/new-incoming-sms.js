const bandwidth = require("../../bandwidth.app");

module.exports = {
  name: "New Incoming SMS",
  description: "Emits an event each time a `message-received` event is received at the source url",
  key: "bandwidth-new-incoming-sms",
  version: "1.1.1",
  type: "source",
  props: {
    bandwidth,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },

  async run(event) {
    const messageBody = event.body[0];
    this.http.respond({
      status: 204,
    });

    if (messageBody.message.direction == "in") {
      this.$emit(messageBody, {
        summary: "Message Received",
        id: messageBody.message.id,
        ts: +new Date(messageBody.time),
      });
    }
  },
};
