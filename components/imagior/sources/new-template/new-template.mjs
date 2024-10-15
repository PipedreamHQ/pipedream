import imagior from "../../imagior.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "imagior-new-template",
  name: "New Template Created",
  description: "Emit new event when a new template is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    imagior,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    generateMeta(template) {
      return {
        id: template.id,
        summary: `New Template: ${template.name}`,
        ts: Date.parse(template.createdAt),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();

    const templates = await this.imagior.listTemplates({
      params: {
        sort: "createdAt",
        order: "desc",
      },
    });

    if (!templates?.length) {
      return;
    }

    const newTemplates = templates.filter(({ createdAt }) => Date.parse(createdAt) >= lastTs);

    if (!newTemplates?.length) {
      return;
    }

    this._setLastTs(Date.parse(newTemplates[0].createdAt));

    newTemplates.forEach((template) => {
      const meta = this.generateMeta(template);
      this.$emit(template, meta);
    });
  },
};
