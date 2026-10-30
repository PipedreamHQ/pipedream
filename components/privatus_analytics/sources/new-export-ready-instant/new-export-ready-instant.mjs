import app from "../../privatus_analytics.app.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "privatus_analytics-new-export-ready-instant",
  name: "New Export Ready (Instant)",
  description: "Emit new event when an export has finished and its file is ready to download. [See the documentation](https://privatusanalytics.com/docs/api/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
      optional: true,
      description: "Only emit events of this site, e.g. `pa_7Q2K9XH3AB`. Use **Find Site** to get the site ID. Leave it empty for every site.",
    },
  },
  methods: {
    ...common.methods,
    getEvent() {
      return "export.ready";
    },
    getIdKey() {
      return "export_id";
    },
    getSummary(item) {
      return `Export ${item.export_id} is ready`;
    },
    isRelevant(item) {
      return (!this.siteId || (item.site_id || item.check?.site_id) === this.siteId);
    },
  },
  sampleEmit,
};
