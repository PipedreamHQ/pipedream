import shortApp from "../../short.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "short-new-link-created",
  name: "New event for each link created.",
  description: "Emit new event when a link is created.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    shortApp,
    timer: {
      type: "$.interface.timer",
      label: "Watching timer",
      description: "How often to watch the links.",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    domainId: {
      propDefinition: [
        shortApp,
        "domainId",
      ],
    },
  },
  methods: {
    emit(meta) {
      const ts = Date.parse(meta.createdAt);
      this.$emit(meta, {
        id: meta.idString,
        summary: meta.secureShortURL,
        ts,
      });
    },
  },
  async run() {
    const links = await this.shortApp.listLinks(this.domainId);
    for (const link of links) {
      this.emit(link);
    }
  },
};
