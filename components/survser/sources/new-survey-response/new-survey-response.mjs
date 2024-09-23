import survser from "../../survser.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "survser-new-survey-response",
  name: "New Survey Response",
  description: "Emit new event when a new survey response is received. [See the documentation](https://docs.survser.com/docs/api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    survser,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    surveyId: {
      propDefinition: [
        survser,
        "surveyId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(25);
    },
  },
  methods: {
    _getLastCreated() {
      return this.db.get("lastCreated");
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    emitEvent(response) {
      const meta = this.generateMeta(response);
      this.$emit(response, meta);
    },
    generateMeta(response) {
      return {
        id: response.id,
        summary: `New Response for Survey: ${response.survey.name}`,
        ts: Date.parse(response.createdAt),
      };
    },
    async processEvents(max) {
      const lastCreated = this._getLastCreated();
      let responses = await this.survser.getSurveyResponses({
        params: {
          surveyId: this.surveyId,
        },
      });
      if (!responses?.length) {
        return;
      }
      if (max) {
        responses = responses.slice(-1 * max);
      }
      this._setLastCreated(Date.parse(responses[responses.length - 1].createdAt));
      for (const response of responses.reverse()) {
        const ts = Date.parse(response.createdAt);
        if (ts >= lastCreated) {
          this.emitEvent(response);
        } else {
          return;
        }
      }
    },
  },
  async run() {
    await this.processEvents();
  },
  sampleEmit,
};
