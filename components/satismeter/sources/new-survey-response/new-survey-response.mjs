import satismeter from "../../satismeter.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "satismeter-new-survey-response",
  name: "New Survey Response",
  description: "Emits a new event when a survey response is submitted to a project. [See the documentation](https://app.satismeter.com/apidoc)",
  version: "0.0.{{ts}}",
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
    projectId: {
      propDefinition: [
        satismeter,
        "projectId",
      ],
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
    _getLastResponseId() {
      return this.db.get("lastResponseId") || null;
    },
    _setLastResponseId(id) {
      this.db.set("lastResponseId", id);
    },
  },
  async run() {
    const {
      projectId, surveyId,
    } = this;
    const lastResponseId = this._getLastResponseId();
    let hasMore = true;
    let pageCursor = null;

    while (hasMore) {
      const responses = await this.satismeter.getSurveyResponses({
        projectId,
        surveyId,
        pageCursor,
      });

      for (const response of responses.data) {
        if (lastResponseId && response.id <= lastResponseId) {
          hasMore = false;
          break;
        }
        this.$emit(response, {
          id: response.id,
          summary: `New response from survey ${surveyId}`,
          ts: Date.parse(response.created),
        });
      }

      if (responses.page.hasNextPage) {
        pageCursor = responses.page.nextPageCursor;
      } else {
        hasMore = false;
      }
    }

    this._setLastResponseId(responses.data[0].id);
  },
};
