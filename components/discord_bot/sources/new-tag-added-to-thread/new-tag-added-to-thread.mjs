import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import common from "../common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "discord_bot-new-tag-added-to-thread",
  name: "New Tag Added to Thread",
  description: "Emit new event when a new tag is added to a thread",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const tags = {};
      const { threads } = await this.discord.listThreads({
        guildId: this.guildId,
      });
      threads.forEach((thread) => {
        if (thread?.applied_tags) {
          tags[thread.id] = thread?.applied_tags;
        }
      });
      this._setTags(tags);
    },
  },
  methods: {
    ...common.methods,
    _getTags() {
      return this.db.get("tags") || {};
    },
    _setTags(tags) {
      this.db.set("tags", tags);
    },
    generateMeta(thread) {
      return {
        id: thread.id,
        summary: `New tag in thread ${thread.id}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    let tags = this._getTags();

    const { threads } = await this.discord.listThreads({
      guildId: this.guildId,
    });

    for (const thread of threads) {
      if (!thread.applied_tags) {
        continue;
      }
      if (thread.applied_tags.some((tag) => !tags[thread.id].includes(tag))) {
        const meta = this.generateMeta(thread);
        this.$emit(thread, meta);

        tags[thread.id] = thread.applied_tags;
      }
    }

    this._setTags(tags);
  },
  sampleEmit,
};
