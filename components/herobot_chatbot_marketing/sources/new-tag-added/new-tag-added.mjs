import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../herobot_chatbot_marketing.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "herobot_chatbot_marketing-new-tag-added",
  name: "New Tag Added",
  description: "Emit new event when a new tag is added to a specific user.",
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
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
  },
  methods: {
    _getLastTags() {
      return this.db.get("lastTags") || [];
    },
    _setLastTags(lastTags) {
      this.db.set("lastTags", lastTags);
    },
    filterArray(arr1, arr2) {
      return arr1.filter(({ id }) => {
        return arr2.indexOf(id) === -1;
      });
    },
    generateMeta(event) {
      const ts = new Date();
      return {
        id: event.id + ts,
        summary: `New Tag added: ${event.name}`,
        ts: ts,
      };
    },
    async startEvent() {
      const lastTags = this._getLastTags();

      let tags = await this.app.getUserTags({
        userId: this.userId,
      });
      const filteredTags = this.filterArray(tags, lastTags);

      for (const tag of filteredTags.reverse()) {
        const tagInfo = await this.app.getTag({
          tagId: tag.id,
        });

        this.$emit(tagInfo, this.generateMeta(tagInfo));
      }

      if (tags.length) this._setLastTags(tags.map((item) => item.id));
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
