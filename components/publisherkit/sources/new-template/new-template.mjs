import publisherkit from "../../publisherkit.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "publisherkit-new-template",
  name: "New Template Created",
  description: "Emit new event when a new template is created within your PublisherKit account. [See the documentation](https://publisherkit.com/documentation/api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    publisherkit,
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
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastCreated() {
      return this.db.get("lastCreated") || 0;
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    generateMeta(template) {
      return {
        id: template.id,
        summary: `New Template ${template.name}`,
        ts: template.created,
      };
    },
    async processEvent(max) {
      const lastCreated = this._getLastCreated();
      let maxCreated = lastCreated;
      let count = 0;
      const templates = await this.publisherkit.listTemplates();
      for (const template of templates) {
        if (template.created > lastCreated) {
          const meta = this.generateMeta(template);
          this.$emit(template, meta);
          if (template.created > maxCreated) {
            maxCreated = template.created;
          }
          count++;
          if (max && count >= max) {
            break;
          }
        }
      }
      this._setLastCreated(maxCreated);
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
