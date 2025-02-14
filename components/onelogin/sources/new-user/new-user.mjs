import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import onelogin from "../../onelogin.app.mjs";

export default {
  key: "onelogin-new-user",
  name: "New User Created",
  description: "Emit a new event when a user is created in OneLogin. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    onelogin,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    filterUserRole: {
      propDefinition: [
        onelogin,
        "filterUserRole",
      ],
      optional: true,
    },
    filterGroup: {
      propDefinition: [
        onelogin,
        "filterGroup",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const lastRun = this.db.get("lastRun");
      const now = new Date().toISOString();
      const since = lastRun || new Date(Date.now() - this.timer.intervalSeconds * 1000).toISOString();
      const params = {
        event_type_id: "13",
        since,
        limit: 50,
        sort: "-created_at",
      };
      const events = await this.onelogin._makeRequest({
        path: "/events",
        params,
      });
      for (const event of events) {
        if (this.filterUserRole && event.role_id !== parseInt(this.filterUserRole, 10)) {
          continue;
        }
        if (this.filterGroup && event.group_id !== parseInt(this.filterGroup, 10)) {
          continue;
        }
        this.$emit(event, {
          id: event.id.toString(),
          summary: `New user created: ${event.user_name}`,
          ts: Date.parse(event.created_at) || Date.now(),
        });
      }
      this.db.set("lastRun", now);
    },
    async activate() {
      // No webhook setup required for polling source
    },
    async deactivate() {
      // No webhook cleanup required for polling source
    },
  },
  async run() {
    const lastRun = this.db.get("lastRun");
    const now = new Date().toISOString();
    const params = {
      event_type_id: "13",
      since: lastRun || new Date(Date.now() - this.timer.intervalSeconds * 1000).toISOString(),
      limit: 100,
      sort: "-created_at",
    };
    const events = await this.onelogin._makeRequest({
      path: "/events",
      params,
    });
    for (const event of events) {
      if (this.filterUserRole && event.role_id !== parseInt(this.filterUserRole, 10)) {
        continue;
      }
      if (this.filterGroup && event.group_id !== parseInt(this.filterGroup, 10)) {
        continue;
      }
      this.$emit(event, {
        id: event.id.toString(),
        summary: `New user created: ${event.user_name}`,
        ts: Date.parse(event.created_at) || Date.now(),
      });
    }
    this.db.set("lastRun", now);
  },
};
