import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import convenia from "../../convenia.app.mjs";

export default {
  key: "convenia-new-dismissal",
  name: "New Dismissal",
  description: "Emit new event when an employee is dismissed.",
  version: "0.0.{{{{ts}}}}",
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
    _getDismissalId(dismissal) {
      return dismissal.id;
    },
    _getCursor() {
      return this.db.get("cursor") || null;
    },
    _setCursor(cursor) {
      this.db.set("cursor", cursor);
    },
  },
  async run() {
    const lastCursor = this._getCursor();
    let newCursor = null;

    const dismissedEmployees = await this.convenia.getEmployees();

    for (const employee of dismissedEmployees) {
      if (employee.dismissal) {
        const dismissalId = this._getDismissalId(employee.dismissal);

        if (!newCursor) {
          newCursor = dismissalId;
        }

        if (lastCursor && dismissalId <= lastCursor) {
          break;
        }

        this.$emit(employee.dismissal, {
          id: dismissalId,
          summary: `New Dismissal: ${employee.name}`,
          ts: Date.now(),
        });
      }
    }

    if (newCursor) {
      this._setCursor(newCursor);
    }
  },
};
