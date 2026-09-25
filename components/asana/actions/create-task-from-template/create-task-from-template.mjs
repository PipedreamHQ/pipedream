import common from "../common/common.mjs";

export default {
  name: "Create Task from Template",
  key: "asana-create-task-from-template",
  description: "Creates a new Asana task by instantiating an existing task template. Use this when a team has a reusable task structure (e.g. a bug-report or onboarding template); for ad-hoc tasks use **Create Task**. Use **List Task Templates** to find the template GID. This kicks off an asynchronous job — the response is a job resource, not the finished task; `new_task.gid` is available immediately but the task's fields may still be populating, so use **Find Task by ID** if you need to confirm it's ready. The new task's project and memberships are determined by the template itself, not by any project passed here. Example: call with `taskTemplateId: '1205678901234567'`, `name: 'Bug: Login page crash'` → returns `{gid: '1205555555555555', resource_type: 'job', new_task: {gid: '1206789012345678'}}`. [See the documentation](https://developers.asana.com/reference/instantiatetask)",
  version: "0.0.11",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    taskTemplateId: {
      propDefinition: [
        common.props.asana,
        "taskTemplate",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new task. If not provided, the name of the task template will be used.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.asana.createTaskFromTemplate({
      $,
      taskTemplateId: this.taskTemplateId,
      data: {
        data: {
          name: this.name,
        },
      },
    });
    $.export("$summary", `Successfully created task with ID ${response.data.new_task.gid}`);
    return response;
  },
};
