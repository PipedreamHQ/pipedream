import { axios } from "@pipedream/platform";
import littleGreenLight from "../../little_green_light.app.mjs";

export default {
  key: "little_green_light-new-constituent-created",
  name: "New Constituent Created",
  description: "Emits an event for each new constituent created in Little Green Light. [See the documentation](https://api.littlegreenlight.com/api-docs/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    littleGreenLight,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    ...littleGreenLight.methods,
    async fetchConstituents(since) {
      const path = `/constituents.json?created_at_gt=${since}`;
      const response = await this.littleGreenLight._makeRequest({
        path,
      });
      return response.items;
    },
  },
  hooks: {
    async deploy() {
      // Fetch constituents to initialize state
      const lastChecked = this.db.get("lastChecked") || new Date().toISOString();
      const constituents = await this.fetchConstituents(lastChecked);
      constituents.forEach((constituent) => {
        this.$emit(constituent, {
          id: constituent.id,
          summary: `New Constituent: ${constituent.first_name} ${constituent.last_name}`,
          ts: Date.parse(constituent.created_at),
        });
      });

      // Update state
      if (constituents.length > 0) {
        const mostRecent = constituents.reduce((max, { created_at }) => Date.parse(created_at) > max
          ? Date.parse(created_at)
          : max, 0);
        this.db.set("lastChecked", new Date(mostRecent).toISOString());
      }
    },
  },
  async run() {
    const lastChecked = this.db.get("lastChecked") || new Date().toISOString();
    const newConstituents = await this.fetchConstituents(lastChecked);

    newConstituents.forEach((constituent) => {
      this.$emit(constituent, {
        id: constituent.id,
        summary: `New Constituent: ${constituent.first_name} ${constituent.last_name}`,
        ts: Date.parse(constituent.created_at),
      });
    });

    if (newConstituents.length > 0) {
      const mostRecent = newConstituents.reduce((max, { created_at }) => Date.parse(created_at) > max
        ? Date.parse(created_at)
        : max, 0);
      this.db.set("lastChecked", new Date(mostRecent).toISOString());
    }
  },
};
