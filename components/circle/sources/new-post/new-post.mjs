import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import circle from "../../circle.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "circle-new-post",
  name: "New Post Published",
  description: "Emit new event each time a new post gets published in the community.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
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
      const response = this.circle.paginate({
        fn: this.circle.listPosts,
        maxResults,
        params: {
          status: "all",
          community_id: this.communityId,
          space_id: this.spaceId,
        },
      });

      const responseArray = [];

      for await (const item of response) {
        if (item.id <= lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastId(responseArray[0].id);
      }

      for (const event of responseArray.reverse()) {
        this.$emit(event, {
          id: event.id,
          summary: `New post with ID: ${event.id}`,
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
  sampleEmit,
};
