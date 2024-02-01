import { axios } from "@pipedream/platform";
import edusign from "../../edusign.app.mjs";

export default {
  key: "edusign-new-admin",
  name: "New Admin Added",
  description: "Emits an event when a new admin is added in Edusign.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    edusign,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60, // 1 minute
      },
    },
  },
  hooks: {
    async deploy() {
      const lastFetched = this.db.get("lastFetched") || 0;
      const admins = await this.edusign._makeRequest({
        path: "/admins",
        params: {
          since: new Date(lastFetched).toISOString(),
        },
      });

      const latestAdmins = admins.slice(-50).reverse(); // Get the last 50 admins, most recent first
      for (const admin of latestAdmins) {
        this.$emit(admin, {
          id: admin.id,
          summary: `New Admin: ${admin.name}`,
          ts: Date.parse(admin.created_at),
        });
      }

      if (admins.length > 0) {
        const latestTimestamp = Math.max(...admins.map((a) => Date.parse(a.created_at)));
        this.db.set("lastFetched", latestTimestamp);
      }
    },
  },
  methods: {
    // Utilize the existing methods from the app file if needed
  },
  async run() {
    const lastFetched = this.db.get("lastFetched") || 0;
    const latestAdmins = await this.edusign._makeRequest({
      path: "/admins",
      params: {
        since: new Date(lastFetched).toISOString(),
      },
    });

    for (const admin of latestAdmins) {
      this.$emit(admin, {
        id: admin.id,
        summary: `New Admin: ${admin.name}`,
        ts: Date.parse(admin.created_at),
      });
    }

    if (latestAdmins.length > 0) {
      const latestTimestamp = Math.max(...latestAdmins.map((a) => Date.parse(a.created_at)));
      this.db.set("lastFetched", latestTimestamp);
    }
  },
};
