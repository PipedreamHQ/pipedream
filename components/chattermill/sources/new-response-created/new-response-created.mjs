import chattermill from "../../chattermill.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "chattermill-new-response-created",
  name: "New Response Created",
  description: "Emit new event when a new response is created. [See the documentation](https://apidocs.chattermill.com/#3dd30375-7956-b872-edbd-873eef126b2d)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    chattermill,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        chattermill,
        "projectId",
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    generateMeta(response) {
      return {
        id: response.id,
        summary: `New response created: ${response.id}`,
        ts: Date.parse(response.created_at),
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const results = this.chattermill.paginate({
        fn: this.chattermill.listResponses,
        args: {
          projectId: this.projectId,
          params: {
            from: lastTs,
          },
        },
        resourceKey: "responses",
      });

      let responses = [];
      for await (const response of results) {
        if (!maxTs || Date.parse(response.created_at) > Date.parse(maxTs)) {
          maxTs = response.created_at;
        }
        responses.push(response);
      }

      if (!responses.length) {
        return;
      }

      this._setLastTs(maxTs);

      if (max && responses.length > max) {
        responses = responses.slice(0, max);
      }

      responses.forEach((response) => {
        const meta = this.generateMeta(response);
        this.$emit(response, meta);
      });
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
