import howuku from "../../howuku.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "howuku-new-incoming-survey",
  name: "New Incoming Survey",
  description: "Emit new event when a new incoming survey is received.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    howuku,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    surveyToTrack: {
      propDefinition: [
        howuku,
        "surveyToTrack",
      ],
    },
  },
  methods: {
    _getStoredCursor() {
      return this.db.get("cursor") || null;
    },
    _setStoredCursor(cursor) {
      this.db.set("cursor", cursor);
    },
  },
  async run() {
    const cursor = this._getStoredCursor();
    const params = {
      survey: this.surveyToTrack,
    };

    if (cursor) {
      params.cursor = cursor;
    }

    const { data } = await this.howuku._makeRequest({
      method: "GET",
      path: "/surveys",
      params,
    });

    if (data.length > 0) {
      const newCursor = data[data.length - 1].id;
      this._setStoredCursor(newCursor);

      for (const survey of data) {
        this.$emit(survey, {
          id: survey.id,
          summary: `New survey: ${survey.title}`,
          ts: Date.parse(survey.created_at),
        });
      }
    }
  },
};
