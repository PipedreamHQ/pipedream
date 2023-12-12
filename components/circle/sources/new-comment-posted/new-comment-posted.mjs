import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import circle from "../../circle.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "circle-new-comment-posted",
  name: "New Comment Posted",
  description: "Emit new event each time a new comment is posted in the selected community space.",
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
    postId: {
      propDefinition: [
        circle,
        "postId",
        ({
          communityId, spaceId,
        }) => ({
          communityId,
          spaceId,
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
      const response = await this.circle.listComments({
        params: {
          community_id: this.communityId,
          space_id: this.spaceId,
          post_id: this.postId,
        },
      });

      if (maxResults && response.length > maxResults) response.length = maxResults;

      if (response.length) {
        this._setLastId(response[0].id);
      }

      const responseArray = response.filter((item) => item.id > lastId);

      for (const event of responseArray.reverse()) {
        this.$emit(event, {
          id: event.id,
          summary: `New comment with ID: ${event.id}`,
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
