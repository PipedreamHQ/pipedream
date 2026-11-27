import app from "../../karbon.app.mjs";

export default {
  key: "karbon-get-work-item",
  name: "Get Work Item",
  description: "Get the details of one work item, including its assignee, client, dates and status."
    + " Use **List Work Items** to find the work item."
    + " [See the documentation](https://karbonhq.github.io/karbon-api-reference/#get-/v3/WorkItems/-WorkItemKey-)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    workItemKey: {
      propDefinition: [
        app,
        "workItemKey",
      ],
    },
  },
  async run({ $ }) {
    const workItem = await this.app.getWorkItem({
      $,
      workItemKey: this.workItemKey,
    });
    $.export("$summary", `Retrieved work item ${workItem.Title}`);
    return workItem;
  },
};
