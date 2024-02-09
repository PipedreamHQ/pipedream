import { axios } from "@pipedream/platform";
import qualetics from "../../qualetics.app.mjs";

export default {
  key: "qualetics-new-exception",
  name: "New Exception",
  description: "Emit new event when an exception occurs on the website or app. Only exceptions identified as critical will be reported but ones with lower severity can be fetched.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    qualetics: {
      type: "app",
      app: "qualetics",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    severityLevel: {
      propDefinition: [
        qualetics,
        "severityLevel",
      ],
      optional: true,
    },
  },
  methods: {
    _getLastExecutionTime() {
      return this.db.get("lastExecutionTime") ?? this.timer.intervalSeconds;
    },
    _setLastExecutionTime(lastExecutionTime) {
      this.db.set("lastExecutionTime", lastExecutionTime);
    },
  },
  hooks: {
    async deploy() {
      const exceptions = await this.qualetics.getExceptions(this.severityLevel);
      if (exceptions.length > 0) {
        exceptions.slice(0, 50).forEach((exception) => {
          this.$emit(exception, {
            id: exception.id,
            summary: `New Exception: ${exception.name}`,
            ts: Date.parse(exception.created_at),
          });
        });
      }
      this._setLastExecutionTime(Date.now());
    },
  },
  async run() {
    const lastExecutionTime = this._getLastExecutionTime();
    const exceptions = await this.qualetics.getExceptions(this.severityLevel);
    exceptions.forEach((exception) => {
      const exceptionTime = Date.parse(exception.created_at);
      if (exceptionTime > lastExecutionTime) {
        this.$emit(exception, {
          id: exception.id,
          summary: `New Exception: ${exception.name}`,
          ts: exceptionTime,
        });
      }
    });
    this._setLastExecutionTime(Date.now());
  },
};
