import common from "../common/common-hook.mjs";

export default {
  key: "podio-new-task-created",
  name: "New Task Created",
  description: "Emit new events when a new task is created. [See the docs here](https://developers.podio.com/doc/hooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  ...common,
  props: {
    ...common.props,
    orgId: {
      propDefinition: [
        common.props.app,
        "orgId",
      ],
    },
    spaceId: {
      propDefinition: [
        common.props.app,
        "spaceId",
        (configuredProps) => ({
          orgId: configuredProps.orgId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getMeta(event) {
      return {
        id: event?.body?.task_id,
        ts: Date.now(),
        summary: `New task created (ID:${event?.body?.task_id})`,
      };
    },
    async getData(event) {
      return this.app.getTask({
        taskId: event?.body?.task_id,
      });
    },
    getEvent() {
      return  "task.create";
    },
    getRefType() {
      return  "space";
    },
    getRefId() {
      return  this.spaceId;
    },
    async loadHistoricalEvents() {
      const tasks = await this.app.getTasks({
        params: {
          space: this.spaceId,
        },
      });
      for (const task of tasks) {
        this.$emit(
          task,
          this.getMeta({
            body: task,
          }),
        );
      }
    },
  },
};
