import app from "../../ftrack.app.mjs";
import expressions from "../../common/expressions/task.mjs";

export default {
  key: "ftrack-get-task-info",
  name: "Get Task Info",
  description: "Get information about a task. [See the documentation](https://help.ftrack.com/en/articles/1040498-operations#query)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    taskId: {
      propDefinition: [
        app,
        "taskId",
      ],
    },
  },
  methods: {
    getTaskInfo({
      taskId, ...args
    } = {}) {
      return this.app.query({
        data: {
          expression: expressions.getTaskInfo(taskId),
        },
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      getTaskInfo,
      taskId,
    } = this;

    const [
      response,
    ] = await getTaskInfo({
      step,
      taskId,
    });

    if (!response.data.length) {
      step.export("$summary", "No task found.");
    } else {
      step.export("$summary", `Successfully retrieved task with ID \`${response.data[0].id}\`.`);
    }

    return response.data;
  },
};
