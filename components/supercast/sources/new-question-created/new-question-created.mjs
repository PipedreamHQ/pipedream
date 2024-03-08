import supercastApp from "../../supercast.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "supercast-new-question-created",
  name: "New Question Created",
  description: "Emits a new event when a new question is created. [See the documentation](https://supercast.readme.io/reference/getquestions)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    supercast: {
      type: "app",
      app: "supercast",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    channelSubdomain: {
      propDefinition: [
        supercastApp,
        "channelSubdomain",
      ],
    },
  },
  methods: {
    _getStoredQuestionId() {
      return this.db.get("storedQuestionId") ?? null;
    },
    _storeQuestionId(questionId) {
      this.db.set("storedQuestionId", questionId);
    },
  },
  hooks: {
    async deploy() {
      // Fetch the most recent questions to backfill events
      const questions = await this.supercast.createChannelQuestion({
        channelSubdomain: this.channelSubdomain,
        title: this.title,
        body: this.body,
      });

      // Sort questions by created_at date in descending order
      questions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // Emit up to 50 most recent questions
      for (const question of questions.slice(0, 50)) {
        this.$emit(question, {
          id: question.id,
          summary: `New Question: ${question.title}`,
          ts: Date.parse(question.created_at),
        });
      }

      // Store the most recent question ID for future polling
      if (questions.length > 0) {
        this._storeQuestionId(questions[0].id);
      }
    },
  },
  async run() {
    const lastStoredQuestionId = this._getStoredQuestionId();
    let maxQuestionId = lastStoredQuestionId;

    // Poll for new questions
    let page = 1;
    while (true) {
      const response = await this.supercast.createChannelQuestion({
        channelSubdomain: this.channelSubdomain,
        title: this.title,
        body: this.body,
        page,
      });

      if (response.length === 0) {
        break;
      }

      for (const question of response) {
        if (lastStoredQuestionId && question.id <= lastStoredQuestionId) {
          // We've processed this question already, stop processing
          break;
        }

        // Emit the new question
        this.$emit(question, {
          id: question.id,
          summary: `New Question: ${question.title}`,
          ts: Date.parse(question.created_at),
        });

        // Update maxQuestionId if the current question's ID is greater
        if (!maxQuestionId || question.id > maxQuestionId) {
          maxQuestionId = question.id;
        }
      }

      page += 1;
    }

    // Store the max question ID for the next run
    if (maxQuestionId) {
      this._storeQuestionId(maxQuestionId);
    }
  },
};
