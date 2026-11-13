import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-prompt-agent",
  name: "Prompt Agent",
  description: "Sends a prompt to a Taskade AI agent and returns the agent's reply in the `summary` field."
    + " The agent can use its knowledge and tools, and each prompt uses AI credits of the workspace plan."
    + " Use **List Agents** to find the agent ID, with the same `folderId` that holds the agent."
    + " [See the documentation](https://docs.taskade.com/developers/api-v2-reference)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
      description: "The ID of the folder that holds the agent, e.g. `a1b2c3d4e5f6g7h8`."
        + " The `Home` folder has the same ID as the workspace."
        + " Use **List Folders** to find it (the `id` field).",
    },
    agentId: {
      propDefinition: [
        taskade,
        "agentId",
        (c) => ({
          folderId: c.folderId,
        }),
      ],
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The message to send to the agent, e.g. `Summarize the open tasks in the Launch Plan project`.",
    },
  },
  async run({ $ }) {
    const response = await this.taskade.promptAgent({
      $,
      data: {
        spaceId: this.folderId,
        agentId: this.agentId,
        prompt: this.prompt,
      },
    });
    $.export("$summary", `Successfully prompted agent with ID ${this.agentId}`);
    return response;
  },
};
