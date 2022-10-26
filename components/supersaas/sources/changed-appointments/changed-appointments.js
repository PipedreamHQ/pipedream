const dayjs = require("dayjs");
const makeEventSummary = require("../utils/makeEventSummary.js");
const supersaas = require("../../supersaas.app.js");

module.exports = {
  key: "supersaas-changed-appointments",
  name: "New or changed appointments",
  description: "Emits an event for every changed appointments from the selected schedules.",
  version: "0.0.2",
  type: "source",
  props: {
    supersaas,
    schedules: {
      propDefinition: [
        supersaas,
        "schedules",
      ],
    },
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const {
        http,
        schedules,
      } = this;

      this.db.set("activeHooks", await this.supersaas.createHooks(schedules.map((x) => ({
        event: "C", // change_appointment
        parent_id: Number(x),
        target_url: http.endpoint,
      }))));
    },
    async deactivate() {
      await this.supersaas.destroyHooks(this.db.get("activeHooks") || []);
      this.db.set("activeHooks", []);
    },
  },
  async run(ev) {
    const outEv = {
      meta: {
        summary: makeEventSummary(ev),
        ts: dayjs(ev.body.created_on).valueOf(),
      },
      body: ev.body,
    };

    console.log("Emitting:", outEv);
    this.$emit(outEv, outEv.meta);
  },
};
