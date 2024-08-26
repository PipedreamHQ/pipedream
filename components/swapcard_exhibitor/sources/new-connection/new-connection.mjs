import { axios } from "@pipedream/platform";
import swapcardExhibitor from "../../swapcard_exhibitor.app.mjs";

export default {
  key: "swapcard_exhibitor-new-connection",
  name: "New Connection Formed",
  description: "Emit new event when a new connection is formed (new lead). [See the documentation](https://developer.swapcard.com/organizer/content-api/graphql-event-api-schema/queries/events)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    swapcardExhibitor,
    db: "$.service.db",
    eventId: {
      propDefinition: [
        swapcardExhibitor,
        "eventId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // Poll every 15 minutes
      },
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
    async _fetchNewConnections() {
      const leads = await this.swapcardExhibitor.getEventPeople(this.eventId);
      const lastTimestamp = this._getLastTimestamp();
      const newLeads = leads.filter((lead) => new Date(lead.createdAt).getTime() > lastTimestamp);
      return newLeads;
    },
  },
  hooks: {
    async deploy() {
      const newLeads = await this._fetchNewConnections();
      newLeads.slice(0, 50).forEach((lead) => {
        this.$emit(lead, {
          id: lead.id,
          summary: `New connection: ${lead.firstName} ${lead.lastName}`,
          ts: new Date(lead.createdAt).getTime(),
        });
      });
      if (newLeads.length > 0) {
        const latestTs = new Date(newLeads[0].createdAt).getTime();
        this._setLastTimestamp(latestTs);
      }
    },
    async activate() {
      // No special activation steps required
    },
    async deactivate() {
      // No special deactivation steps required
    },
  },
  async run() {
    const newLeads = await this._fetchNewConnections();
    newLeads.forEach((lead) => {
      this.$emit(lead, {
        id: lead.id,
        summary: `New connection: ${lead.firstName} ${lead.lastName}`,
        ts: new Date(lead.createdAt).getTime(),
      });
    });
    if (newLeads.length > 0) {
      const latestTs = new Date(newLeads[0].createdAt).getTime();
      this._setLastTimestamp(latestTs);
    }
  },
};
