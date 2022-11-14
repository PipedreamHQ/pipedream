const dayjs = require("dayjs");
const makeEventSummary = require("../../common/utils/makeEventSummary.js");
const supersaas = require("../supersaas.app.js");

module.exports = {
  key: "supersaas-credit-balance-changes",
  name: "Credit balance changes",
  description: "Emits an event for every user credit balance changes for the selected schedules.",
  version: "0.0.1",
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
      const { $auth } = this.supersaas;
      const {
        http, schedules,
      } = this;

      this.db.set("activeHooks", await this.supersaas.createHooks([
        {
          event: "M", // modified_user
          parent_id: $auth.account,
          target_url: http.endpoint,
        },
        {
          event: "P", // purchase
          parent_id: $auth.account,
          target_url: http.endpoint,
        },
        ...schedules.map((x) => ({
          event: "C", // change_appointment
          parent_id: Number(x),
          target_url: http.endpoint,
        })),
      ]));
    },

    async deactivate() {
      await this.supersaas.destroyHooks(this.db.get("activeHooks"));
      this.db.set("activeHooks", []);
    },
  },
  async run(ev) {
    // Ignore appointments created/deleted by admins (i.e. when email is null).
    if (!ev.body.email) {
      console.log("Ignoring:", ev.body.event, "(but !ev.body.email)");
      return;
    }

    if (ev.body.event === "create" && !ev.body.price) {
      console.log("Ignoring:", ev.body.event, "(but !ev.body.price)");
      return;
    }

    if (ev.body.event === "edit" && !ev.body.deleted) {
      console.log("Ignoring:", ev.body.event, "(but !ev.body.deleted)");
      return;
    }

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
