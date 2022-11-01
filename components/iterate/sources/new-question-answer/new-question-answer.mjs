import iterate from "../../iterate.app.mjs";

export default {
  name: "New Question Answer",
  version: "0.0.3",
  key: "iterate-new-question-answer",
  description: "Emit new event on a question is answered.",
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
        id: data.id,
        summary: `New question answer with id ${data.id}`,
        ts: Date.parse(data.updated_at[0]),
      });
    },
    _setLastAnswerId(id) {
      this.db.set("lastAnswerId", id);
    },
    _getLastAnswerId() {
      return this.db.get("lastAnswerId");
    },
  },
  hooks: {
    async deploy() {
      const { results: { list: answers } } = await this.iterate.getAnswers({
        surveyId: this.surveyId,
      });

      answers.slice(10).forEach(this.emitEvent);
    },
  },
  async run() {
    const lastAnswerId = this._getLastAnswerId();

    let nextUrl;

    do {
      const options = {
        surveyId: this.surveyId,
      };

      if (nextUrl) {
        options.url = nextUrl;
      }

      const {
        links, results: { list: answers },
      } = await this.iterate.getAnswers(options);

      answers.reverse().forEach(this.emitEvent);

      this._setLastAnswerId(answers[0].id);

      if (
        answers.length < 100 ||
        answers.filter((answer) => answer.id === lastAnswerId).length
      ) {
        return;
      }

      nextUrl = links?.next ?? null;
    } while (nextUrl);
  },
};
