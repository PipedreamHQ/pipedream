import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "breathe",
  version: "0.0.{{ts}}",
  propDefinitions: {
    sessionType: {
      type: "string",
      label: "Session Type",
      description: "The type of guided breathing session",
      optional: true,
      async options() {
        const sessions = await this.getSessionTypes();
        return sessions.map((session) => ({
          label: session.name,
          value: session.id,
        }));
      },
    },
    intensity: {
      type: "string",
      label: "Intensity",
      description: "The intensity level of the breathing session",
      optional: true,
      async options() {
        return [
          {
            label: "Low",
            value: "low",
          },
          {
            label: "Medium",
            value: "medium",
          },
          {
            label: "High",
            value: "high",
          },
        ];
      },
    },
    milestoneType: {
      type: "string",
      label: "Milestone Type",
      description: "The type of breathing milestone",
      optional: true,
      async options() {
        const milestones = await this.getMilestoneTypes();
        return milestones.map((milestone) => ({
          label: milestone.name,
          value: milestone.id,
        }));
      },
    },
    typeOfActivity: {
      type: "string",
      label: "Activity Type",
      description: "The type of breathing activity to log",
      async options() {
        const activities = await this.getActivityTypes();
        return activities.map((activity) => ({
          label: activity.name,
          value: activity.id,
        }));
      },
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "Duration of the session or activity in minutes",
      optional: true,
      min: 1,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Optional notes for the breathing activity",
      optional: true,
    },
    reminderMessage: {
      type: "string",
      label: "Reminder Message",
      description: "Personalized message for the reminder",
    },
    deliveryTime: {
      type: "string",
      label: "Delivery Time",
      description: "Time to send the reminder (ISO 8601 format)",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.breathehr.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers = {}, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async getSessionTypes(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/sessions/types",
        ...opts,
      });
    },
    async getMilestoneTypes(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/milestones/types",
        ...opts,
      });
    },
    async getActivityTypes(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/activities/types",
        ...opts,
      });
    },
    async startSession({
      sessionType, duration, intensity, ...opts
    }) {
      const data = {
        session_type: sessionType,
        duration,
        intensity,
      };
      return this._makeRequest({
        method: "POST",
        path: "/sessions/start",
        data,
        ...opts,
      });
    },
    async logActivity({
      typeOfActivity, duration, notes, ...opts
    }) {
      const data = {
        activity_type: typeOfActivity,
        duration,
        notes,
      };
      return this._makeRequest({
        method: "POST",
        path: "/activities/log",
        data,
        ...opts,
      });
    },
    async sendReminder({
      reminderMessage, deliveryTime, ...opts
    }) {
      const data = {
        message: reminderMessage,
        delivery_time: deliveryTime,
      };
      return this._makeRequest({
        method: "POST",
        path: "/reminders/send",
        data,
        ...opts,
      });
    },
    async emitNewSessionEvent(filters = {}) {
      // Implementation depends on Pipedream's event emission capabilities
      // Example:
      // this.$emit({ session: filters });
    },
    async emitMilestoneReachedEvent(milestoneType = null) {
      // Implementation depends on specifics
      // Example:
      // this.$emit({ milestone: milestoneType });
    },
    async emitReportGeneratedEvent() {
      // Implementation depends on specifics
      // Example:
      // this.$emit({ report: "new_stress_relaxation_report" });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let hasMore = true;
      let page = 1;

      while (hasMore) {
        const response = await fn({
          page,
          ...opts,
        });
        if (!response || response.length === 0) {
          hasMore = false;
        } else {
          results = results.concat(response);
          page += 1;
        }
      }

      return results;
    },
  },
};
