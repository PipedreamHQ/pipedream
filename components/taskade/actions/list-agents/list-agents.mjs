import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-list-agents",
  name: "List Agents",
  description: "Lists the AI agents in a Taskade workspace folder."
    + " Each agent has an `id`, a `name` and its settings in `data`."
    + " Use the `id` with **Prompt Agent** and the same `folderId`."
    + " To list the agents of the workspace itself, use the `Home` folder."
    + " Use **List Workspaces** and **List Folders** to find the IDs."
    + " [See the documentation](https://docs.taskade.com/developers/comprehensive-api-guide/folders/get-folder-agents)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    taskade,
    workspaceId: {
      propDefinition: [
        taskade,
        "workspaceId",
      ],
    },
    folderId: {
      propDefinition: [
        taskade,
        "folderId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    maxResults: {
      propDefinition: [
        taskade,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const items = this.taskade.paginateByPage({
      resourceFn: this.taskade.listAgents,
      args: {
        $,
        folderId: this.folderId,
      },
      max: this.maxResults,
    });
    const agents = [];
    for await (const item of items) {
      agents.push(item);
    }
    $.export("$summary", `Successfully retrieved ${agents.length} agent${agents.length === 1
      ? ""
      : "s"}`);
    return agents;
  },
};
