import browserUse from "../../browser_use.app.mjs";
import {
  cleanObject, parseOptionalObject,
} from "../../common/utils.mjs";

export default {
  key: "browser_use-create-run",
  name: "Create V4 Run",
  description:
    "Create a Browser Use V4 run for a new task, or continue an existing V4 session with a Session ID. Configure the model, browser settings, workspace, AgentMail, and cost limit; only one run can be active per session. [See the documentation](https://api.browser-use.com/api/v4/openapi.json)",
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
      description: "Current V4 model ID from the API schema. Example: `gpt-5.6-luna`. Leave blank to use the API default.",
      optional: true,
    },
    sessionId: {
      propDefinition: [
        browserUse,
        "v4SessionId",
      ],
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
      description: "Optional V4 browser settings JSON. Example: `{\"proxyCountryCode\":\"us\"}`.",
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
      description: "Maximum run cost in USD. Example: `1.50`.",
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
