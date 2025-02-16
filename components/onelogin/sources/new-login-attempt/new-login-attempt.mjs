import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import onelogin from "../../onelogin.app.mjs";

export default {
  key: "onelogin-new-login-attempt",
  name: "New Login Attempt",
  description: "Emit new event when a login attempt occurs in OneLogin. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    onelogin: {
      type: "app",
      app: "onelogin",
    },
    db: {
      type: "$.service.db",
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    filterLoginSuccess: {
      propDefinition: [
        "onelogin",
        "filterLoginSuccess",
      ],
    },
    filterLoginFailure: {
      propDefinition: [
        "onelogin",
        "filterLoginFailure",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.fetchAndEmitEvents(true);
    },
    async activate() {
      // No webhook setup required for polling source
    },
    async deactivate() {
      // No webhook cleanup required for polling source
    },
  },
  methods: {
    async fetchAndEmitEvents(isDeploy = false) {
      const lastCursor = await this.db.get("after_cursor");
      const params = {
        limit: 50,
        sort: "-created_at",
      };

      if (lastCursor) {
        params.after_cursor = lastCursor;
      }

      // Define event_type_ids that correspond to login attempts
      // These IDs should be replaced with actual ones from OneLogin
      const loginAttemptEventTypeIds = [
        5,
        13,
      ];
      params.event_type_id = loginAttemptEventTypeIds.join(",");

      const response = await this.onelogin._makeRequest({
        path: "/events",
        params,
      });

      const events = response;

      // Emit events from oldest to newest
      for (const event of events.reverse()) {
        if (this._isLoginAttempt(event) && this._matchesFilters(event)) {
          const eventId = event.id
            ? event.id.toString()
            : undefined;
          const eventTimestamp = event.created_at
            ? Date.parse(event.created_at)
            : Date.now();
          const emitMeta = {
            id: eventId || undefined,
            summary: `Login attempt by ${event.user_name}`,
            ts: eventTimestamp,
          };
          this.$emit(event, emitMeta);
        }
      }

      // Update the cursor
      if (events.length > 0 && response.pagination && response.pagination.after_cursor) {
        await this.db.set("after_cursor", response.pagination.after_cursor);
      }
    },
    _isLoginAttempt(event) {
      return [
        5,
        13,
      ].includes(event.event_type_id);
    },
    _matchesFilters(event) {
      let isSuccess = !event.error_description;
      if (this.filterLoginSuccess && isSuccess) {
        return true;
      }
      if (this.filterLoginFailure && !isSuccess) {
        return true;
      }
      if (!this.filterLoginSuccess && !this.filterLoginFailure) {
        return true;
      }
      return false;
    },
  },
  async run() {
    await this.fetchAndEmitEvents();
  },
};
