const calendly = require("../calendly.app.js");
const get = require("lodash/get");

module.exports = {
  props: {
    calendly,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const events = this.getEvents();
      const body = {
        url: this.http.endpoint,
        events,
      };
      const resp = await this.calendly.createHook(body);
      this.db.set("hookId", resp.data.id);
    },
    async deactivate() {
      await this.calendly.deleteHook(this.db.get("hookId"));
    },
  },
  methods: {
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    generateInviteeMeta(body) {
      const eventId = get(body, "payload.event.uuid");
      const inviteeId = get(body, "payload.invitee.uuid");
      const summary = get(body, "payload.event_type.name");
      const ts = Date.parse(get(body, "time"));
      return {
        id: `${eventId}${inviteeId}`,
        summary,
        ts,
      };
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["x-calendly-hook-id"] != this.db.get("hookId")) {
      return this.http.respond({
        status: 404,
      });
    }

    this.http.respond({
      status: 200,
    });

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
