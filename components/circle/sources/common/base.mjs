import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import circle from "../../circle.app.mjs";

export default {
  props: {
    circle,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    communityId: {
      propDefinition: [
        circle,
        "communityId",
      ],
    },
    spaceId: {
      propDefinition: [
        circle,
        "spaceId",
        ({ communityId }) => ({
          communityId,
        }),
      ],
      optional: true,
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      return this.db.set("lastId", lastId);
    },
    async startEvent(maxResults = false) {
      const lastId = this._getLastId();

      const responseArray = await this.getResponse({
        maxResults,
        lastId,
      });

      for (const event of responseArray.reverse()) {
        this.$emit(event, {
          id: event.id,
          summary: this.getSummary(event),
          ts: Date.parse(event.created_at),
        });
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
