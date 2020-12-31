const activecampaign = require("../../activecampaign.app.js");

module.exports = {
  name: "New Contact Note (Instant)",
  key: "activecampaign-new-contact-note",
  description: "Emits an event each time a new note is added to a contact.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    activecampaign,
    db: "$.service.db",
    http: "$.interface.http",
    contacts: { propDefinition: [activecampaign, "contacts"] },
  },
  hooks: {
    async activate() {
      const sources = ["public", "admin", "api", "system"]; // all available sources
      const hookData = await this.activecampaign.createHook(
        ["subscriber_note"],
        this.http.endpoint,
        sources
      );
      this.db.set("hookId", hookData.webhook.id);
    },
    async deactivate() {
      await this.activecampaign.deleteHook(this.db.get("hookId"));
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }
    if (
      this.contacts.length > 0 &&
      !this.contacts.includes(body["contact[id]"])
    )
      return;
    const dateTime = new Date(body.date_time);
    this.$emit(body, {
      id: `${body["contact[id]"]}${dateTime.getTime()}`,
      summary: body.note,
      ts: dateTime.getTime(),
    });
  },
};