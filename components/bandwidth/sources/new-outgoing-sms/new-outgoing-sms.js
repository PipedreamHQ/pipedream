const bandwidth = require("../../bandwidth.app");

module.exports = {
  name: "New Outgoing SMS",
  description:
    "Emits an event each time an outbound message status event is received at the source url",
  key: "bandwidth-new-outgoing-sms",
  version: "1.1.2",
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

    if (messageBody.message.direction == "out") {
      this.$emit(messageBody, {
        summary: messageBody.type,
        id: messageBody.message.id,
        ts: +new Date(messageBody.time),
      });
    }
  },
};
