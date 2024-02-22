import yespo from "../../yespo.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "yespo-new-contact-in-segment",
  name: "New Contact in Segment",
  description: "Emits an event when a contact is added to a specific segment in Yespo. [See the documentation]()",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    yespo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    segment: {
      propDefinition: [
        yespo,
        "segment",
      ],
    },
  },
  methods: {
    _getStartDate() {
      return this.db.get("start_date") ?? new Date().toISOString();
    },
    _setStartDate(date) {
      this.db.set("start_date", date);
    },
  },
  hooks: {
    async deploy() {
      const start_date = this._getStartDate();
      const contacts = await this.yespo.getContactsFromSegment({
        segmentId: this.segment,
        start_date,
      });

      contacts.forEach((contact) => {
        this.$emit(contact, {
          id: contact.id.toString(),
          summary: `New Contact: ${contact.firstName} ${contact.lastName}`,
          ts: Date.parse(contact.created_at),
        });
      });

      if (contacts.length > 0) {
        const mostRecentDate = contacts[contacts.length - 1].created_at;
        this._setStartDate(mostRecentDate);
      }
    },
  },
  async run() {
    const start_date = this._getStartDate();
    const contacts = await this.yespo.getContactsFromSegment({
      segmentId: this.segment,
      start_date,
    });

    contacts.forEach((contact) => {
      this.$emit(contact, {
        id: contact.id.toString(),
        summary: `New Contact: ${contact.firstName} ${contact.lastName}`,
        ts: Date.parse(contact.created_at),
      });
    });

    if (contacts.length > 0) {
      const mostRecentDate = contacts[contacts.length - 1].created_at;
      this._setStartDate(mostRecentDate);
    }
  },
};
