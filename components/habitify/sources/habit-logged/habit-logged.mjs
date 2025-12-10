import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "habitify-habit-logged",
  name: "Habit Logged",
  description: "Emit new event when a new log is created for the selected habit(s). [See the documentation](https://docs.habitify.me/core-resources/habits/logs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    habitIds: {
      propDefinition: [
        common.props.habitify,
        "habitIds",
      ],
    },
  },
  methods: {
    ...common.methods,
    _getLastTs() {
      return this.db.get("lastTs") || this.convertToUTCOffset(this.getCurrentDateTime());
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    generateMeta(log) {
      return {
        id: log.id,
        summary: `New log with ID ${log.id} created for habit ${log.habit_id}`,
        ts: Date.parse(log.created_date),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;
    const params = {
      from: lastTs,
      to: this.convertToUTCOffset(this.getCurrentDateTime()),
    };
    const logs = [];
    for (const habitId of this.habitIds) {
      const { data } = await this.habitify.getHabitLogs({
        habitId,
        params,
      });
      if (!data.length) {
        continue;
      }
      logs.push(...data);
      if (Date.parse(data[data.length - 1].created_date) > Date.parse(maxTs)) {
        maxTs = this.convertToUTCOffset(data[data.length - 1].created_date);
      }
    }
    this._setLastTs(maxTs);
    logs.sort((a, b) => Date.parse(a.created_date) - Date.parse(b.created_date));
    logs.forEach((log) => {
      this.$emit(log, this.generateMeta(log));
    });
  },
  sampleEmit,
};
