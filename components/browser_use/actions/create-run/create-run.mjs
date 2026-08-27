import browserUse from "../../browser_use.app.mjs";
import {
  cleanObject, parseOptionalObject,
} from "../../common/utils.mjs";

export default {
  key: "browser_use-create-run",
  name: "Create V4 Run",
  description:
    "Create a Browser Use V4 run. [See the API reference](https://api.browser-use.com/api/v4/openapi.json)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    browserUse,
    task: {
      type: "string",
      label: "Task",
      description: "What the browser agent should do.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "Current V4 model ID. Leave blank to use the API default.",
      optional: true,
    },
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "Continue an existing V4 session.",
      optional: true,
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "Attach an existing workspace.",
      optional: true,
    },
    browserSettings: {
      type: "object",
      label: "Browser Settings",
      description: "Optional V4 browser settings object.",
      optional: true,
    },
    agentmail: {
      type: "boolean",
      label: "Enable AgentMail",
      description:
        "Provision a persistent temporary inbox for the run workspace.",
      optional: true,
      default: false,
    },
    maxCostUsd: {
      type: "string",
      label: "Max Cost USD",
      description: "Maximum run cost in USD.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.createRun({
      $,
      data: cleanObject({
        task: this.task,
        model: this.model,
        sessionId: this.sessionId,
        workspaceId: this.workspaceId,
        browserSettings: parseOptionalObject(
          this.browserSettings,
          "Browser Settings",
        ),
        agentmail: this.agentmail,
        maxCostUsd: this.maxCostUsd,
      }),
    });

    $.export(
      "$summary",
      `Created V4 run ${response.id} in session ${response.sessionId}`,
    );
    return response;
  },
};
