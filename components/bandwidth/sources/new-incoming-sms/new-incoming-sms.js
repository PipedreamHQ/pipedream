module.exports = {
  name: "New Incoming SMS",
  description: "Emits an event each time a `message-received` event is received at the source url",
  props: {
    http: {
        type: "$.interface.http",
        customResponse: true
      },
    },

  async run(event) {
    let messageBody = event.body[0]
    this.http.respond({
      status: 204,
      });

    if (messageBody.type == "message-received"){
      this.$emit(messageBody, {
        summary: "Message Received"
      })
    },
  },
};
