import habitify from "../../habitify.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Habit Created",
  version: "0.0.1",
  key: "habitify-new-habit-created",
  description: "Emit new event on each created habit.",
  type: "source",
  dedupe: "unique",
  props: {
    habitify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
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
};
