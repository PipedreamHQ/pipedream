import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import zohoSubscriptions from "../../zoho_subscriptions.app.mjs";

export default {
  key: "zoho_subscriptions-subscription-created",
  name: "New Subscription Created",
  version: "0.0.1",
  description: "Emit new event when a new subscription is created.",
  type: "source",
  dedupe: "unique",
  props: {
    zohoSubscriptions,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Zoho Subscriptions on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    organizationId: {
      propDefinition: [
        zohoSubscriptions,
        "organizationId",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate");
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults) {
      const lastDate = this._getLastDate();
      let responseArray = [];

      const items = this.zohoSubscriptions.paginate({
        fn: this.zohoSubscriptions.listEvents,
        params: {
          event_type: "subscription_created",
          date_start: lastDate || "1970-01-01",
          date_end: moment().format("YYYY-MM-DD"),
        },
        organizationId: this.organizationId,
        maxResults,
      });

      for await (const item of items) {
        responseArray.push(item);
      }

      if (responseArray[0]) {
        this._setLastDate(responseArray[0].event_time);
      }

      for (const responseItem of responseArray.reverse()) {
        const event = await this.zohoSubscriptions.getEvent({
          eventId: responseItem.event_id,
          organizationId: this.organizationId,
        });

        event.event.payload = JSON.parse(event.event.payload);

        this.$emit(
          event,
          {
            id: responseItem.event_id,
            summary: `New event with id: "${responseItem.event_id}" was created!`,
            ts: new Date(),
          },
        );
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
};
