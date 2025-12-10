import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "habitify-habit-status-updated",
  name: "Habit Status Updated",
  description: "Emit new event when the status of a habit is updated. [See the documentation](https://docs.habitify.me/core-resources/habits/status)",
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
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "The statuses to watch for. [See the documentation](https://docs.habitify.me/core-resources/habits/status)",
      options: [
        "in_progress",
        "completed",
        "skipped",
        "failed",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const previousStatuses = {};
      for (const habitId of this.habitIds) {
        const { data } = await this.habitify.getHabitStatus({
          habitId,
          params: {
            target_date: this.convertToUTCOffset(this.getCurrentDateTime()),
          },
        });
        previousStatuses[habitId] = data.status;
      }
      this._setPreviousStatuses(previousStatuses);
    },
  },
  methods: {
    ...common.methods,
    _getPreviousStatuses() {
      return this.db.get("previousStatuses") || {};
    },
    _setPreviousStatuses(statuses) {
      this.db.set("previousStatuses", statuses);
    },
    generateMeta(status) {
      return {
        id: `${status.habit_id}-${status.progress.reference_date}`,
        summary: `New Status ${status.status} for habit ${status.habit_id}`,
        ts: Date.parse(status.progress.reference_date),
      };
    },
  },
  async run() {
    const previousStatuses = this._getPreviousStatuses();
    const currentStatuses = {};
    const targetDate = this.convertToUTCOffset(this.getCurrentDateTime());
    for (const habitId of this.habitIds) {
      const { data } = await this.habitify.getHabitStatus({
        habitId,
        params: {
          target_date: targetDate,
        },
      });
      currentStatuses[habitId] = data.status;
      if (
        previousStatuses[habitId] !== data.status
        && (!this.statuses || this.statuses.includes(data.status))
      ) {
        this.$emit(data, this.generateMeta(data));
      }
    }
    this._setPreviousStatuses(currentStatuses);
  },
  sampleEmit,
};
