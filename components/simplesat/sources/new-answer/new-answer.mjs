import app from "../../simplesat.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  dedupe: "unique",
  type: "source",
  key: "simplesat-new-answer",
  name: "New Answer",
  description: "Emit new event when a new answer is created",
  version: "0.0.2",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the new answers",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _setLastAnswerId(id) {
      this.db.set("lastAnswerId", id);
    },
    _getLastAnswerId() {
      return this.db.get("lastAnswerId");
    },
  },
  async run() {
    let page = 1;
    let firstId = null;
    const lastId = this._getLastAnswerId();
    do {
      const res = await this.app.listAnswers(page);
      console.log(page);
      if (res.answers[0] && !firstId) {
        firstId = res.answers[0].id;
      }

      for (const answer of res.answers) {
        if (answer.id === lastId) {
          console.log("Found last answer, stopping");
          return;
        }
        this.$emit(answer, {
          id: answer.id,
          summary: answer.answer_label,
          ts: answer.created,
        });
      }
      if (!res.next) {
        break;
      }
      page++;
    } while (true);
    this._setLastAnswerId(firstId);
  },
};
