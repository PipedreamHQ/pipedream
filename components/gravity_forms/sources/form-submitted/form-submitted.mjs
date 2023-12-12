import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import gravityForms from "../../gravity_forms.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "gravity_forms-form-submitted",
  name: "New Form Submission",
  description: "Emit new event when a new form submission is received.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    gravityForms,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    formId: {
      propDefinition: [
        gravityForms,
        "formId",
      ],
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async startEvent(maxResults = false) {
      const lastId = this._getLastId();
      const response = this.gravityForms.paginate({
        fn: this.gravityForms.listEntries,
        formId: this.formId,
        maxResults,
      });

      const responseArray = [];

      for await (const item of response) {
        if (item.id <= lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastId(responseArray[0].id);
      }

      for (const event of responseArray.reverse()) {
        this.$emit(event, {
          id: event.id,
          summary: `New Form Submission with ID: ${event.id}`,
          ts: Date.parse(event.date_created),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
