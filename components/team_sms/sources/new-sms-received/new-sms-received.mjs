import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../team_sms.app.mjs";

export default {
  key: "team_sms-new-sms-received",
  name: "New SMS Received",
  description: "Emit new event for each new SMS received. [See the documentation](https://teamsms.io/api-doc)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Schedule",
      description: "How often to poll the API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    listSms(args = {}) {
      return this.app._makeRequest({
        debug: true,
        path: "/sms",
        ...args,
      });
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New SMS: ${resource.id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
  async run() {
    const {
      listSms,
      generateMeta,
    } = this;

    const resources = await listSms();

    Array.from(resources)
      .reverse()
      .forEach((resource) => {
        this.$emit(resource, generateMeta(resource));
      });
  },
};
