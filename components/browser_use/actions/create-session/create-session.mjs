import browserUse from "../../browser_use.app.mjs";
import { CACHE_SCRIPT_OPTIONS } from "../../common/constants.mjs";
import {
  cleanObject,
  getCacheScriptValue,
  getProxyCountryCode,
  parseOptionalObject,
} from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "browser_use-create-session",
  name: "Create Session",
  description: "Create an agent session, dispatch a task, or dispatch a follow-up task to an existing idle session. [See the documentation](https://docs.browser-use.com/cloud/api-v3/sessions/create-session)",
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
      description: "Natural-language instruction for the agent. Example: `Go to example.com and summarize the pricing page`. Required when dispatching to an existing session.",
      optional: true,
    },
    model: {
      propDefinition: [
        browserUse,
        "model",
      ],
    },
    sessionId: {
      propDefinition: [
        browserUse,
        "sessionId",
      ],
      optional: true,
    },
    keepAlive: {
      type: "boolean",
      label: "Keep Alive",
      description: "If true, the session stays idle after the task completes so it can accept follow-up tasks.",
      optional: true,
      default: false,
    },
    maxCostUsd: {
      type: "string",
      label: "Max Cost USD",
      description: "Maximum total session cost in USD. Example: `1.50`.",
      optional: true,
    },
    profileId: {
      propDefinition: [
        browserUse,
        "profileId",
      ],
    },
    workspaceId: {
      propDefinition: [
        browserUse,
        "workspaceId",
      ],
    },
    proxyCountryCode: {
      propDefinition: [
        browserUse,
        "proxyCountryCode",
      ],
    },
    outputSchema: {
      type: "object",
      label: "Output Schema",
      description: "Optional JSON Schema for structured output. Example: `{\"type\":\"object\",\"properties\":{\"price\":{\"type\":\"number\"},\"title\":{\"type\":\"string\"}}}`.",
      optional: true,
    },
    enableScheduledTasks: {
      type: "boolean",
      label: "Enable Scheduled Tasks",
      description: "If true, the agent can create scheduled tasks tied to your project.",
      optional: true,
      default: false,
    },
    sensitiveData: {
      type: "object",
      label: "Sensitive Data",
      description: "Optional key-value pairs available to the agent through secure placeholders. Example: `{\"password\":\"secret-value\"}`. Keys are visible to the model; values are hidden but may appear in screenshots if typed into unmasked fields.",
      optional: true,
    },
    enableRecording: {
      type: "boolean",
      label: "Enable Recording",
      description: "If true, Browser Use records the browser session and returns recording URLs after completion.",
      optional: true,
      default: false,
    },
    skills: {
      type: "boolean",
      label: "Enable Skills",
      description: "If true, enables built-in Browser Use agent skills such as file management.",
      optional: true,
      default: true,
    },
    agentmail: {
      type: "boolean",
      label: "Enable AgentMail",
      description: "If true, provisions a temporary email inbox for the session.",
      optional: true,
      default: true,
    },
    cacheScript: {
      type: "string",
      label: "Cache Script",
      description: "Controls deterministic script caching. Auto enables caching when the task contains `@{{value}}` placeholders and a workspace is attached.",
      options: CACHE_SCRIPT_OPTIONS,
      optional: true,
      default: "auto",
    },
    useOwnKey: {
      type: "boolean",
      label: "Use Own Key",
      description: "If true, uses your configured LLM provider key instead of Browser Use managed keys.",
      optional: true,
      default: false,
    },
    autoHeal: {
      type: "boolean",
      label: "Auto Heal",
      description: "When script caching is active, validates cached script output and reruns the full agent if the result looks incorrect.",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    if (this.sessionId && !this.task) {
      throw new ConfigurationError("Task is required when dispatching to an existing session.");
    }

    const response = await this.browserUse.createSession({
      $,
      data: cleanObject({
        task: this.task,
        model: this.model,
        sessionId: this.sessionId,
        keepAlive: this.keepAlive,
        maxCostUsd: this.maxCostUsd,
        profileId: this.profileId,
        workspaceId: this.workspaceId,
        proxyCountryCode: getProxyCountryCode(this.proxyCountryCode),
        outputSchema: parseOptionalObject(this.outputSchema, "Output Schema"),
        enableScheduledTasks: this.enableScheduledTasks,
        sensitiveData: parseOptionalObject(this.sensitiveData, "Sensitive Data"),
        enableRecording: this.enableRecording,
        skills: this.skills,
        agentmail: this.agentmail,
        cacheScript: getCacheScriptValue(this.cacheScript),
        useOwnKey: this.useOwnKey,
        autoHeal: this.autoHeal,
      }),
    });

    $.export("$summary", this.task
      ? `Created session ${response.id} and dispatched task`
      : `Created idle session ${response.id}`);
    return response;
  },
};
