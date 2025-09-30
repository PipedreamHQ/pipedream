import bitdefender from "../../bitdefender_gravityzone.app.mjs";

export default {
  key: "bitdefender_gravityzone-get-scan-task-status",
  name: "Get Scan Task Status",
  description: "Get the status of a scan task. [See the documentation(https://www.bitdefender.com/business/support/en/77209-440638-gettaskstatus.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bitdefender,
    taskId: {
      propDefinition: [
        bitdefender,
        "taskId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bitdefender.getTaskStatus({
      $,
      data: {
        params: {
          taskId: this.taskId,
        },
      },
    });

    $.export("$summary", `Successfully retrieved status for task ${this.taskId}`);
    return response;
  },
};
