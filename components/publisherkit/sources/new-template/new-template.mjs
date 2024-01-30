import { axios } from "@pipedream/platform";
import publisherkit from "../../publisherkit.app.mjs";

export default {
  key: "publisherkit-new-template",
  name: "New Template Created",
  description: "Emits an event when a new template is created within your PublisherKit account. [See the documentation](https://publisherkit.com/documentation/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    publisherkit,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    async getTemplates() {
      return await this.publisherkit._makeRequest({
        path: "/v1/api/templates",
      });
    },
  },
  async run() {
    const lastRunTime = this.db.get("lastRunTime") || this.timer.intervalSeconds;
    const now = new Date();
    const templates = await this.getTemplates();

    for (const template of templates) {
      const templateCreatedTime = new Date(template.created);
      if (templateCreatedTime.getTime() > lastRunTime) {
        this.$emit(template, {
          id: template.id,
          summary: `New template: ${template.name}`,
          ts: templateCreatedTime.getTime(),
        });
      }
    }

    this.db.set("lastRunTime", now.getTime());
  },
};
