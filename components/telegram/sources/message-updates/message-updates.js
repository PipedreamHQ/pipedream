const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-message-updates",
  name: "Message Updates",
  description: "Emits an event each time a Telegram message is created or updated.",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    telegram,
  },
  hooks: {
    async activate() {
      const response = await this.telegram.createHook(this.http.endpoint, ['message', 'edited_message']);
      console.log(response.data.description);
    },
    async deactivate() {
      const response = await this.telegram.deleteHook();
      console.log(response.data.description);
    },
  },
  async run(event) {
    if ((event.path).substring(1) !== this.telegram.$auth.token) {
      return;
    }
    this.http.respond({
      status: 200,
    });
    const { body } = event;
    if (!body) {
      return;
    }
    this.$emit(body, 
      {
        id: body.update_id,
        summary: body.message.text,
        ts: Date.now()
      }
    );
  },
};