import common from "../common/common.mjs";

export default {
  ...common,
  key: "firmao-new-task",
  name: "New Task",
  description:
    "Emit new event when a new task is created. [See the documentation](https://firmao.net/API-Documentation_EN.pdf)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getSummary(event) {
      return `New Task - ${event.name}`;
    },
  },
  async run({ $ }) {
    const { data: tasks } = await this.app.getTasks({
      $,
      params: {
        sort: "creationDate",
        dir: "DESC",
      },
    });
    this.processEvents(tasks);
  },
};
