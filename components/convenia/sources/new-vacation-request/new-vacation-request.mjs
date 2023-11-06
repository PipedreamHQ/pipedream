import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import convenia from "../../convenia.app.mjs";

export default {
  key: "convenia-new-vacation-request",
  name: "New Vacation Request",
  description: "Emits an event when there is a new vacation request at the company.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    convenia,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastVacationRequestId() {
      return this.db.get("lastVacationRequestId") || null;
    },
    _setLastVacationRequestId(id) {
      this.db.set("lastVacationRequestId", id);
    },
  },
  async run() {
    const lastVacationRequestId = this._getLastVacationRequestId();
    const { data: vacations } = await this.convenia.getVacations();

    for (const vacation of vacations.reverse()) {
      if (lastVacationRequestId && vacation.id === lastVacationRequestId) {
        break;
      }

      this.$emit(vacation, {
        id: vacation.id,
        summary: `New vacation request from employee: ${vacation.employee_id}`,
        ts: Date.now(),
      });
    }

    if (vacations.length > 0) {
      this._setLastVacationRequestId(vacations[0].id);
    }
  },
};
