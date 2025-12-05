import posthog from "../../posthog.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "posthog-new-action-performed",
  name: "New Action Performed",
  description: "Emit new event when an action is performed in a project. [See the documentation](https://posthog.com/docs/api/query#post-api-projects-project_id-query)",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  props: {
    posthog,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    organizationId: {
      propDefinition: [
        posthog,
        "organizationId",
      ],
    },
    projectId: {
      propDefinition: [
        posthog,
        "projectId",
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    generateMeta(event) {
      return {
        id: event.uuid,
        summary: `New ${event.event} event`,
        ts: Date.parse(event.timestamp),
      };
    },
    buildQuery(limit) {
      const lastTs = this._getLastTs();
      let query = "SELECT * FROM events";
      if (lastTs) {
        query += ` WHERE timestamp > '${lastTs}'`;
      }
      query += " ORDER BY timestamp DESC";
      if (limit) {
        query += ` LIMIT ${limit}`;
      }
      return query;
    },
    formatEvents(columns, results) {
      return results.map((result) => {
        const values = {};
        for (let i = 0; i < columns.length; i++) {
          values[columns[i]] = result[i];
        }
        return values;
      });
    },
    async processEvent(limit) {
      const {
        columns, results,
      } = await this.posthog.createQuery({
        projectId: this.projectId,
        data: {
          query: {
            kind: "HogQLQuery",
            query: this.buildQuery(limit),
          },
        },
      });
      const events = this.formatEvents(columns, results);
      if (!events?.length) {
        return;
      }
      this._setLastTs(events[0].timestamp.slice(0, 19));
      events.reverse().forEach((event) => this.emitEvent(event));
    },
  },
  async run() {
    await this.processEvent();
  },
};
