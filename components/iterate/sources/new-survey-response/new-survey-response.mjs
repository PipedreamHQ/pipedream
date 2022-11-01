import iterate from "../../iterate.app.mjs";

export default {
  name: "New Survey Response",
  version: "0.0.3",
  key: "iterate-new-survey-response",
  description: "Emit new event on a survey is responded.",
  type: "source",
  dedupe: "unique",
  props: {
    iterate,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    surveyId: {
      propDefinition: [
        iterate,
        "surveyId",
      ],
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: `${data.user.id}-${data.completed_at}`,
        summary: `New survey response with user id ${data.user.id}`,
        ts: Date.parse(data.completed_at),
      });
    },
    _setLastResponseId(id) {
      this.db.set("lastResponseId", id);
    },
    _getLastResponseId() {
      return this.db.get("lastResponseId");
    },
  },
  hooks: {
    async deploy() {
      const { results: { response_groups: responses } } = await this.iterate.getResponses({
        surveyId: this.surveyId,
      });

      responses.slice(10).forEach(this.emitEvent);
    },
  },
  async run() {
    const lastResponseId = this._getLastResponseId();

    let nextUrl;

    do {
      const options = {
        surveyId: this.surveyId,
      };

      if (nextUrl) {
        options.url = nextUrl;
      }

      const {
        links, results: { response_groups: responses },
      } = await this.iterate.getResponses(options);

      responses.reverse().forEach(this.emitEvent);

      this._setLastResponseId(responses[0].id);

      if (
        responses.length < 100 ||
        responses.filter((response) => response.id === lastResponseId).length
      ) {
        return;
      }

      nextUrl = links?.next ?? null;
    } while (nextUrl);
  },
};
