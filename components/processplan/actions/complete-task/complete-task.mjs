import app from "../../processplan.app.mjs";

export default {
  key: "processplan-complete-task",
  name: "Complete Task",
  description: "Completes a pending task in an active process, advancing it to the next stage. [See the documentation](https://techdocs.processplan.com/)",
  type: "action",
  version: "0.0.1",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    processTemplateHeaderId: {
      propDefinition: [
        app,
        "processTemplateHeaderId",
      ],
    },
    processTemplateTaskId: {
      propDefinition: [
        app,
        "processTemplateTaskId",
        ({ processTemplateHeaderId }) => ({
          processTemplateHeaderId,
        }),
      ],
    },
    processInstanceHeaderId: {
      propDefinition: [
        app,
        "processInstanceHeaderIdByTask",
        ({ processTemplateTaskId }) => ({
          processTemplateTaskId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      processTemplateTaskId, processInstanceHeaderId,
    } = this;

    const { process_instance_task_list: pendingTasks } =
      await this.app.listPendingTasksByTemplateTask({
        $,
        processTemplateTaskId,
      });

    const task = pendingTasks
      .find(({ it_ih_id }) => String(it_ih_id) === String(processInstanceHeaderId));

    if (!task) {
      throw new Error(`No pending task found for process instance ${processInstanceHeaderId}`);
    }

    const response = await this.app.respondToTask({
      $,
      processInstanceTaskId: task.it_id,
    });

    $.export("$summary", "Successfully completed task");
    return response;
  },
};
