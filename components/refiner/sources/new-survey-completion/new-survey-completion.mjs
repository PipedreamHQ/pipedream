import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import refiner from "../../refiner.app.mjs";

export default {
  key: "refiner-new-survey-completion",
  name: "New Survey Completion",
  description: "Emits a new event whenever a user completes a survey in Refiner. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    refiner: {
      type: "app",
      app: "refiner",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async _fetchSurveyCompletions(since) {
      return this.refiner._makeRequest({
        method: "GET",
        path: "/survey-completions",
        params: {
          since,
        },
      });
    },
    async _getLastRunAt() {
      return this.db.get("lastRunAt") || new Date(0).toISOString();
    },
    async _setLastRunAt(timestamp) {
      await this.db.set("lastRunAt", timestamp);
    },
  },
  hooks: {
    async deploy() {
      let lastRunAt = await this._getLastRunAt();
      const currentRunAt = new Date().toISOString();

      const surveyCompletions = await this._fetchSurveyCompletions(lastRunAt);
      const sortedCompletions = surveyCompletions.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));

      const eventsToEmit = sortedCompletions.slice(0, 50);

      for (const survey of eventsToEmit) {
        const ts = Date.parse(survey.completed_at) || Date.now();
        this.$emit(survey, {
          id: survey.id || ts,
          summary: `Survey completed by user ${survey.user_id || "unknown"}`,
          ts,
        });
      }

      if (eventsToEmit.length > 0) {
        const latestRunAt = eventsToEmit[0].completed_at;
        await this._setLastRunAt(latestRunAt);
      } else {
        await this._setLastRunAt(currentRunAt);
      }
    },
    async activate() {
      // No webhook setup required for polling source
    },
    async deactivate() {
      // No webhook cleanup required for polling source
    },
  },
  async run() {
    const lastRunAt = await this._getLastRunAt();
    const currentRunAt = new Date().toISOString();

    const surveyCompletions = await this._fetchSurveyCompletions(lastRunAt);

    let latestRunAt = lastRunAt;

    for (const survey of surveyCompletions) {
      const ts = Date.parse(survey.completed_at) || Date.now();
      this.$emit(survey, {
        id: survey.id || ts,
        summary: `Survey completed by user ${survey.user_id || "unknown"}`,
        ts,
      });
      if (survey.completed_at > latestRunAt) {
        latestRunAt = survey.completed_at;
      }
    }

    await this._setLastRunAt(latestRunAt || currentRunAt);
  },
};
