import app from "../../maestra.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "maestra-new-file-added",
  name: "New File Added",
  description: "Emit new event when a new file is added to a project in Maestra. [See the documentation](https://maestra.ai/docs#getFiles)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    generateMeta(resource) {
      return {
        id: resource.fileId,
        summary: `New File: ${resource.fileName}`,
        ts: Date.now(),
      };
    },
    processResource(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
  },
  async run() {
    const {
      app,
      processResource,
    } = this;

    const resources = await app.listFiles();

    Array.from(Object.values(resources))
      .forEach(processResource);
  },
};
