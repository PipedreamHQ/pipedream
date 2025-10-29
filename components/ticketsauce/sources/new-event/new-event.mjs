import ticketsauce from "../../ticketsauce.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "ticketsauce-new-event",
  name: "New Event",
  description: "Emit new event when an event is created in Ticketsauce. [See the documentation](https://speca.io/ticketsauce/ticketsauce-public-api?key=204000d6bda66da78315e721920f43aa#list-of-events)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ticketsauce,
    db: "$.service.db",
    alert: {
      type: "alert",
      alertType: "info",
      content: "The TicketSauce API caches responses to the **List of Events** endpoint for 1 hour. This affects how new events are polled. To avoid unnecessary API calls, set the polling interval accordingly. [See the documentation](https://speca.io/ticketsauce/ticketsauce-public-api?key=204000d6bda66da78315e721920f43aa#list-of-events)",
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 60,
      },
    },
    partnerId: {
      propDefinition: [
        ticketsauce,
        "partnerId",
      ],
      description: "Filter events by a specific partner ID (optional)",
    },
    organizationId: {
      propDefinition: [
        ticketsauce,
        "organizationId",
      ],
      description: "Filter events by a specific organization ID (optional)",
    },
  },
  methods: {
    _getLastCreated() {
      return this.db.get("lastCreated") || "1970-01-01 00:00:00";
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    generateMeta(event) {
      return {
        id: event.Event.id,
        summary: `New Event: ${event.Event.name}`,
        ts: Date.parse(event.Event.created),
      };
    },
    async startEvent(maxResults = 0) {
      const lastCreated = this._getLastCreated();

      const events = await this.ticketsauce.listEvents(this, {
        partnerId: this.partnerId,
        organizationId: this.organizationId,
        params: {
          sort_by: "date",
          sort_dir: "desc",
          active_only: false,
        },
      });

      if (!events?.length) {
        return;
      }

      // Filter events created after lastCreated and sort by creation date
      const newEvents = events.filter((event) =>
        Date.parse(event.Event.created) > Date.parse(lastCreated));

      // Sort by created date ascending (oldest first) for emission order
      newEvents.sort((a, b) =>
        Date.parse(a.Event.created) - Date.parse(b.Event.created));

      // Limit results if maxResults is specified
      const eventsToEmit = maxResults && maxResults > 0
        ? newEvents.slice(0, maxResults)
        : newEvents;

      // Update last created date if we have new events
      if (newEvents.length > 0) {
        // Find the most recent created date
        const mostRecentEvent = events.reduce((latest, current) =>
          Date.parse(current.Event.created) > Date.parse(latest.Event.created)
            ? current
            : latest);
        this._setLastCreated(mostRecentEvent.Event.created);
      }

      // Emit events
      for (const event of eventsToEmit) {
        this.$emit(event, this.generateMeta(event));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};

