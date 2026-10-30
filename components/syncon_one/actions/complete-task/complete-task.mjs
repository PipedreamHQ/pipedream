import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-complete-task",
  name: "Complete Task",
  description: "Marks a task done.",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: false },
  props: {
    syncOne,
    id: { type: "string", label: "Task ID", description: "The task to complete." },
  },
  async run({ $ }) {
    const response = await this.syncOne._makeRequest({
      $,
      path: `/tasks/${encodeURIComponent(this.id)}/complete`,
      method: "POST",
    });
    $.export("$summary", `Completed task ${this.id}`);
    return response.data;
  },
};
