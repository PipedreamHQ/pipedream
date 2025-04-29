import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  dedupe: "unique",
  props: {
    db: "$.service.db",
    timer: {
      label: "Polling Interval",
      description: "Pipedream will poll the Docusign API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Watch for envelopes that have been updated to the selected statuses",
      options: [
        "any",
        "completed",
        "created",
        "declined",
        "deleted",
        "delivered",
        "processing",
        "sent",
        "signed",
        "timedout",
        "voided",
      ],
      default: [
        "any",
      ],
    },
  },
  methods: {
    _getLastEvent() {
      return this.db.get("lastEvent") || this.monthAgo().toISOString();
    },
    _setLastEvent(lastEvent) {
      this.db.set("lastEvent", lastEvent);
    },
    monthAgo() {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo;
    },
    generateMeta({
      envelopeId, emailSubject, statusChangedDateTime,
    }) {
      const ts = Date.parse(statusChangedDateTime);
      return {
        id: `${envelopeId}-${ts}`,
        summary: emailSubject,
        ts,
      };
    },
  },
  async run(event) {
    const { timestamp: ts } = event;
    const lastEvent = this._getLastEvent();
    const baseUri = await this.docusign.getBaseUri({
      accountId: this.account,
    });
    let done = false;
    const params = {
      from_date: lastEvent,
      status: this.status.join(),
    };
    do {
      const {
        envelopes = [],
        nextUri,
        endPosition,
      } = await this.docusign.listEnvelopes(baseUri, params);
      if (nextUri) {
        params.start_position += endPosition + 1;
      }
      else done = true;

      for (const envelope of envelopes) {
        const meta = this.generateMeta(envelope);
        this.$emit(envelope, meta);
      }
    } while (!done);
    this._setLastEvent(new Date(ts * 1000).toISOString());
  },
};
