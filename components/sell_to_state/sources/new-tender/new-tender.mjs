import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../sell_to_state.app.mjs";

export default {
  key: "sell_to_state-new-tender",
  name: "New Tender",
  description: "Emit new event when Sell to State adds a tender that matches your search. [See the docs](https://docs.selltostate.com/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    q: {
      propDefinition: [
        app,
        "q",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    openOnly: {
      type: "boolean",
      label: "Open Tenders Only",
      default: true,
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      await this.emitNewest(10);
    },
  },
  methods: {
    generateMeta(hit) {
      return {
        id: hit.slug,
        summary: hit.title,
        ts: Date.now(),
      };
    },
    async emitNewest(max = 50) {
      // added_desc: the newest rows in Sell to State first; dedupe "unique" drops slugs seen before.
      const { hits = [] } = await this.app.search({
        params: {
          scope: "tenders",
          q: this.q,
          country: this.country,
          lifecycle: this.openOnly === false
            ? undefined
            : "open",
          sort: "added_desc",
          per_page: Math.min(max, 50),
        },
      });
      for (const hit of hits.slice(0, max).reverse()) {
        this.$emit(hit, this.generateMeta(hit));
      }
    },
  },
  async run() {
    await this.emitNewest();
  },
};
