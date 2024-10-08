import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import the_magic_drip from "../../the_magic_drip.app.mjs";

export default {
  key: "the_magic_drip-new-template-created",
  name: "New Template Created",
  description: "Emits a new event when a template is created. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    the_magic_drip,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastRunAt() {
      return this.db.get("lastRunAt") || new Date(0).toISOString();
    },
    _setLastRunAt(timestamp) {
      return this.db.set("lastRunAt", timestamp);
    },
  },
  hooks: {
    async deploy() {
      const lastRunAt = new Date(0).toISOString();
      const newTemplates = await this.the_magic_drip.pollNewTemplates(lastRunAt);
      const sortedTemplates = newTemplates.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      const latest50Templates = sortedTemplates.slice(0, 50);
      for (const template of latest50Templates) {
        this.$emit(template, {
          id: template.templateId || template.createdAt,
          summary: `New Template: ${template.name}`,
          ts: Date.parse(template.createdAt) || Date.now(),
        });
      }
      const newLastRunAt =
        latest50Templates.length > 0
          ? latest50Templates[0].createdAt
          : lastRunAt;
      await this._setLastRunAt(newLastRunAt);
    },
    async activate() {
      // No webhook setup required
    },
    async deactivate() {
      // No webhook teardown required
    },
  },
  async run() {
    const lastRunAt = await this._getLastRunAt();
    const newTemplates = await this.the_magic_drip.pollNewTemplates(lastRunAt);
    const sortedNewTemplates = newTemplates.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );
    for (const template of sortedNewTemplates) {
      this.$emit(template, {
        id: template.templateId || template.createdAt,
        summary: `New Template: ${template.name}`,
        ts: Date.parse(template.createdAt) || Date.now(),
      });
    }
    if (newTemplates.length > 0) {
      const latestCreatedAt = newTemplates.reduce((max, t) =>
        new Date(t.createdAt) > new Date(max)
          ? t.createdAt
          : max,
      lastRunAt);
      await this._setLastRunAt(latestCreatedAt);
    }
  },
};
