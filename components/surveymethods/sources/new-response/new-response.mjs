import surveymethods from "../../surveymethods.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Response",
  version: "0.0.2",
  key: "surveymethods-new-response",
  description: "Emit new event for each response.",
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
    surveyCode: {
      propDefinition: [
        surveymethods,
        "surveyCode",
      ],
    },
  },
  hooks: {
    async deploy() {
      const responses = await this.surveymethods.getResponses({
        surveyCode: this.surveyCode,
        perPage: 10,
      });

      responses.reverse().forEach(this.emitEvent);
    },
  },
  methods: {
    async emitEvent(data) {
      this.$emit(data, {
        id: data.code,
        summary: `New response with code ${data.code}`,
        ts: Date.parse(data.created_date),
      });
    },
  },
  async run() {
    let page = 1;

    while (page >= 0) {
      const responses = await this.surveymethods.getResponses({
        surveyCode: this.surveyCode,
        page,
        perPage: 100,
      });

      responses.reverse().forEach(this.emitEvent);

      if (responses.length < 100) {
        return;
      }

      page++;
    }
  },
};
