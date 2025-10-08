import commpeak from "../../commpeak.app.mjs";

export default {
  key: "commpeak-get-bulk-lookup-results",
  name: "Get Bulk Lookup Results",
  description: "Get results for a bulk lookup operation. [See the documentation](https://lookup.api-docs.commpeak.com/?_gl=1*50xs02*_gcl_au*MTMxMzgzMzA3Ny4xNjk3NTY0NDE3#a447e1e8-f0c3-4068-83d7-e761d89c4a38)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    commpeak,
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The `task_id` returned by the bulk lookup operation",
    },
  },
  async run({ $ }) {
    const response = await this.commpeak.getBulkLookupResults({
      $,
      taskId: this.taskId,
    });
    $.export("$summary", `Successfully obtained results for task ${this.taskId}`);
    return response;
  },
};
