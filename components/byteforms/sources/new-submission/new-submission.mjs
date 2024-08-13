import byteforms from "../../byteforms.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "byteforms-new-submission",
  name: "New Submission",
  description: "Emit new event when a user submission to a form occurs. [See the documentation](https://forms.bytesuite.io/docs/api#endpoints)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    byteforms,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    formId: {
      propDefinition: [
        byteforms,
        "formId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastCreated() {
      return this.db.get("lastCreated") || 0;
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    generateMeta(submission) {
      return {
        id: submission.id,
        summary: `New Form Submission: ${submission.id}`,
        ts: Date.parse(submission.created_at),
      };
    },
    async getSubmissions(max, lastCreated, params) {
      const submissions = [];
      do {
        const {
          cursor, data = [],
        } = await this.byteforms.listFormResponses({
          formId: this.formId,
          params,
        });
        if (!data?.length) {
          return submissions;
        }
        for (const item of data) {
          const ts = Date.parse(item.created_at);
          if (ts >= lastCreated) {
            submissions.push(item);
            if (max && submissions.length >= max) {
              return submissions;
            }
          } else {
            return submissions;
          }
        }
        params.after = cursor?.after;
      } while (params.after);
      return submissions;
    },
    async processEvent(max) {
      const lastCreated = this._getLastCreated();
      const params = {
        order: "desc",
      };
      const submissions = await this.getSubmissions(max, lastCreated, params);
      if (!submissions?.length) {
        return;
      }
      this._setLastCreated(Date.parse(submissions[0].created_at));
      submissions.forEach((submission) => {
        const meta = this.generateMeta(submission);
        this.$emit(submission, meta);
      });
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
