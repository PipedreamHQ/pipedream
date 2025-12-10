import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  name: "New Habit Created",
  version: "0.0.2",
  key: "habitify-new-habit-created",
  description: "Emit new event on each created habit. [See the documentation](https://docs.habitify.me/core-resources/habits#list-habits)",
  type: "source",
  dedupe: "unique",
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `${data.name} - New habit created with ID ${data.id}`,
        ts: Date.parse(data.created_date),
      });
    },
  },
  async run() {
    const { data: habits } = await this.habitify.getHabits();

    habits.reverse().forEach(this.emitEvent);
  },
  sampleEmit,
};
