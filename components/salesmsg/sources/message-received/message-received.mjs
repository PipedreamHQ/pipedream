import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import salesmsg from "../../salesmsg.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "salesmsg-message-received",
  name: "New Message Received",
  version: "0.0.1",
  description: "Emit new event when a new message is received.",
  type: "source",
  dedupe: "unique",
  props: {
    salesmsg,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Salesmsg API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    contactId: {
      propDefinition: [
        salesmsg,
        "contactId",
      ],
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async startEvent(maxResults = 0) {

      const lastId = this._getLastId();
      const items = this.salesmsg.paginateMessages({
        maxResults,
        params: {
          contacts: [
            this.contactId,
          ],
        },
      });

      let responseArray = [];

      for await (const item of items) {
        if (item.id <= lastId) break;
        responseArray.push(item);

        if (responseArray.length) this._setLastId(responseArray[0].id);

        for (const item of responseArray.reverse()) {
          this.$emit(
            item,
            {
              id: item.id,
              summary: `A new message with id: "${item.id}" was received!`,
              ts: item.created_at,
            },
          );
        }
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
