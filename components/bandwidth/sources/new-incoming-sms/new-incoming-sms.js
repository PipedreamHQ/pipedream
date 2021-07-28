import {} from '@bandwidth/messaging'

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
    let messageBody = event.body[1]
    this.http.respond({
      status: 204,
      });
    this.$emit(messageBody, {
      summary: "Message Received"
    })
  },
};
