import workast from "../../app/workast.app";
import { defineSource } from "@pipedream/types";

export default defineSource({
  key: "workast-new-task",
  name: "New Task",
  description: "Emit new event for each new task",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    workast,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    listId: {
      propDefinition: [
        workast,
        "listId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const tasks = await this.workast.getTasks({
        listId: this.listId,
        params: {
          limit: 10,
          order: "createdAt|desc",
        },
      });

      tasks.reverse().forEach(this.emitEvent);
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New task created with id ${data.id}`,
        ts: Date.parse(data.createdAt),
      });
    },
  },
  async run() {
    const tasks = await this.workast.getTasks({
      listId: this.listId,
      params: {
        order: "createdAt|asc",
      },
    });

    tasks.forEach(this.emitEvent);
  },
});
