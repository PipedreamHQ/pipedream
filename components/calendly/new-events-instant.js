const calendly = require("./calendly.app.js");

module.exports = {
  name: "New Events (Instant)",
  description: "Emit an event when a new calendar invite is created via Calendly. The instant trigger uses webhooks and is only available to Calendly Pro users. If you do not have a pro account, use the non-instant version (you can check for new events as frequently as every 15 seconds).",
  version: "0.0.1",
  props: {
    calendly,
    webhook: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { id } = await this.calendly.createHook({
        "url": this.webhook.endpoint,
        "events": [`invitee.created`]
      });
      this.db.set("hookId", id);
    }, 
    async deactivate() {
      await this.calendly.deleteHook({
        hookId: this.db.get("hookId"),
      });
    },
  },
  async run(event) {
    this.webhook.respond({
      status: 200,
    });
    
    const { body, headers } = event
    console.log(body)
    this.$emit(body, {
      summary: JSON.stringify(body),
    });
  },
};
