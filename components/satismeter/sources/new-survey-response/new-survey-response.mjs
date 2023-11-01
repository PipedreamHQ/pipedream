import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import satismeter from "../../satismeter.app.mjs";

export default {
  key: "satismeter-new-survey-response",
  name: "New Survey Response",
  description: "Emit new event when a survey response is submitted to a project. [See the documentation](https://app.satismeter.com/apidoc)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    satismeter,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    surveyId: {
      propDefinition: [
        satismeter,
        "surveyId",
      ],
      optional: true,
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || null;
    },
    _setLastDate(created) {
      this.db.set("lastDate", created);
    },
  },
  async run() {
    const {
      projectId, surveyId,
    } = this;
    const lastDate = this._getLastDate();
    let hasMore = true;
    let pageCursor = null;
    const responseArray = [];

    do {
      const {
        data, page,
      } = await this.satismeter.getSurveyResponses({
        projectId,
        surveyId,
        params: {
          pageCursor,
          startDate: lastDate,
          pageSize: 100,
        },
      });

      for (const response of data) {
        responseArray.push(response);
      }

      hasMore = page.hasNextPage;
      if (hasMore) pageCursor = page.nextPageCursor;

    } while (hasMore);

    if (responseArray.length) this._setLastDate(responseArray[0].created);

    for (const response of responseArray.reverse()) {
      this.$emit(response, {
        id: response.id,
        summary: `New response from survey ${surveyId}`,
        ts: Date.parse(response.created),
      });
    }
  },
};
