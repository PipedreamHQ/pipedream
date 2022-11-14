import surveymethods from "../../surveymethods.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Survey Created",
  version: "0.0.3",
  key: "surveymethods-new-survey-created",
  description: "Emit new event on a survey is created.",
  type: "source",
  dedupe: "unique",
  props: {
    surveymethods,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const surveys = await this.surveymethods.getSurveys({
        perPage: 10,
      });

      surveys.reverse().forEach(this.emitEvent);
    },
  },
  methods: {
    async emitEvent(data) {
      this.$emit(data, {
        id: data.code,
        summary: `New survey created with code ${data.code}`,
        ts: Date.parse(data.created_date),
      });
    },
  },
  async run() {
    let page = 1;

    while (page >= 0) {
      const surveys = await this.surveymethods.getSurveys({
        page,
        perPage: 100,
      });

      surveys.reverse().forEach(this.emitEvent);

      if (surveys.length < 100) {
        return;
      }

      page++;
    }
  },
};
