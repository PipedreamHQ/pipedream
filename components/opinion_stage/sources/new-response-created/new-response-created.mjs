import opinionStage from "../../opinion_stage.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "opinion_stage-new-response-created",
  name: "New Response Created",
  description: "Emit new event when a new response is created in OpinionStage. [See the documentation](https://api.opinionstage.com/api-docs/index.html)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    opinionStage,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    itemId: {
      propDefinition: [
        opinionStage,
        "itemId",
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    async processEvents(max) {
      const lastTs = this._getLastTs();
      let hasMore = true, done = false, page = 1;
      const responses = [];

      do {
        const {
          data, meta,
        } = await this.opinionStage.listResponses({
          itemId: this.itemId,
          params: {
            "page[number]": page,
          },
        });
        if (!data?.length) {
          break;
        }
        for (const response of data) {
          const ts = Date.parse(response.attributes.timestamps.created);
          if (ts >= lastTs) {
            responses.push(response);
            if (max && responses.length >= max) {
              done = true;
              break;
            }
          } else {
            done = true;
            break;
          }
        }
        hasMore = meta.page.current < meta.page.total;
        page++;
      } while (hasMore && !done);

      if (!responses.length) {
        return;
      }

      this._setLastTs(Date.parse(responses[0].attributes.timestamps.created));

      responses.forEach((response) => {
        this.$emit(response, this.generateMeta(response));
      });
    },
    generateMeta(response) {
      return {
        id: response.id,
        summary: `New response created: ${response.id}`,
        ts: Date.parse(response.attributes.timestamps.created),
      };
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(10);
    },
  },
  async run() {
    await this.processEvents();
  },
};
