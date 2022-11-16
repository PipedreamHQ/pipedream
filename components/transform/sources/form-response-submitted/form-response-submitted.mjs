import transform from "../../transform.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "transform-form-response-submitted",
  name: "New Form Response Submitted",
  description: "Emit new event when a response for a form is submitted",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    transform,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    formId: {
      propDefinition: [
        transform,
        "formId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const { result } = await this.transform.getFormResponses({
        formId: this.formId,
        params: {
          pageSize: 25,
          pageNumber: Number.MAX_SAFE_INTEGER,
        },
      });
      this.emitResults(result);
    },
  },
  methods: {
    _getPage() {
      return this.db.get("page") || 1;
    },
    _setPage(page) {
      this.db.set("page", page);
    },
    getMeta(formResponse) {
      const {
        __primaryKey: id,
        requestDate,
      } = formResponse;
      return {
        id,
        summary: `New form response submitted: ${id}`,
        ts: new Date(requestDate),
      };
    },
    emitResults(results) {
      results
        .filter((result) => Object.keys(result).length > 1) // filters unsubmitted responses
        .forEach((result) => this.$emit(result, this.getMeta(result)));
    },
  },
  async run() {
    let page = this._getPage();

    while (true) {
      const {
        result,
        pageCount,
        pageNumber,
      } = await this.transform.getFormResponses({
        formId: this.formId,
        params: {
          pageNumber: page,
        },
      });

      this.emitResults(result);

      if (pageCount === pageNumber) {
        break;
      }

      this._setPage(++page);
    }
  },
};
