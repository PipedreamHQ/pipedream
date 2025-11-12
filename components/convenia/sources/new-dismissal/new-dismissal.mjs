import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import convenia from "../../convenia.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "convenia-new-dismissal",
  name: "New Dismissal",
  description: "Emit new event when an employee is dismissed.",
  version: "0.0.2",
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
    _getLastDate() {
      return this.db.get("lastDate") || "1970-01-01";
    },
    _setLastDate(LastDate) {
      this.db.set("lastDate", LastDate);
    },
    async startEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      let count = 0;
      let tempDate = lastDate;

      const { data: dismissedEmployees } = await this.convenia.getEmployeesTerminated({
        params: {
          from_date: lastDate,
        },
      });

      for (const employee of dismissedEmployees) {
        if (maxResults && (++count >= maxResults)) break;

        if (Date.parse(employee.dismissal.date) > Date.parse(tempDate)) {
          tempDate = employee.dismissal.date;
        }

        this.$emit(employee, {
          id: employee.dismissal.id,
          summary: `New Dismissal with ID: ${employee.dismissal.id}`,
          ts: Date.now(employee.dismissal.date),
        });
      }
      this._setLastDate(tempDate);
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
