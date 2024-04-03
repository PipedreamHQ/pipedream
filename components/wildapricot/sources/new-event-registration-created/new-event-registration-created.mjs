import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "wildapricot-new-event-registration-created",
  name: "New Event Registration Created",
  description: "Emit new event when a registration to an existing event in WildApricot is newly created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    contactId: {
      propDefinition: [
        common.props.wildapricot,
        "contactId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
      optional: true,
    },
    eventId: {
      propDefinition: [
        common.props.wildapricot,
        "eventId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    generateMeta(registration) {
      return {
        id: registration.Id,
        summary: `New Registration ${registration.Id}`,
        ts: Date.parse(registration.RegistrationDate),
      };
    },
  },
  async run() {
    if (!this.eventId && !this.contactId) {
      throw new Error("Must provide one of Contact ID or Event ID");
    }
    const lastTs = this._getLastTs();
    let maxTs = lastTs;
    const eventRegistrations = await this.wildapricot.listEventRegistrations({
      accountId: this.accountId,
      params: {
        contactId: this.contactId,
        eventId: this.eventId,
      },
    });
    for (const registration of eventRegistrations) {
      const ts = Date.parse(registration.RegistrationDate);
      if (ts >= lastTs) {
        maxTs = Math.max(ts, maxTs);
        const meta = this.generateMeta(registration);
        this.$emit(registration, meta);
      }
    }
    this._setLastTs(maxTs);
  },
  sampleEmit,
};
