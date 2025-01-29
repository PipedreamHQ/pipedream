import { axios } from "@pipedream/platform";
import tinyurl from "../../tinyurl.app.mjs";

export default {
  key: "tinyurl-new-link-click-instant",
  name: "New TinyURL Clicked",
  description: "Emit a new event whenever a monitored TinyURL is clicked. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    tinyurl: {
      type: "app",
      app: "tinyurl",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    emitLinkClickMonitoredLinks: {
      propDefinition: [
        "tinyurl",
        "emitLinkClickMonitoredLinks",
      ],
    },
    emitLinkClickFilterGeography: {
      propDefinition: [
        "tinyurl",
        "emitLinkClickFilterGeography",
      ],
      optional: true,
    },
    emitLinkClickFilterDeviceType: {
      propDefinition: [
        "tinyurl",
        "emitLinkClickFilterDeviceType",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // No specific deployment actions required
    },
    async activate() {
      // No specific activation actions required
    },
    async deactivate() {
      // No specific deactivation actions required
    },
  },
  async run() {
    const emit = (data) => {
      const ts = data.timestamp
        ? Date.parse(data.timestamp)
        : Date.now();
      this.$emit(data, {
        id: data.id || ts,
        summary: `Link clicked: ${data.linkId || "unknown"}`,
        ts,
      });
    };

    await this.tinyurl.pollLinkClicks(
      {
        linksToMonitor: this.emitLinkClickMonitoredLinks,
        geographyFilter: this.emitLinkClickFilterGeography,
        deviceTypeFilter: this.emitLinkClickFilterDeviceType,
      },
      emit,
    );
  },
};
