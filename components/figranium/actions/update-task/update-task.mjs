import { ConfigurationError } from "@pipedream/platform";
import app from "../../figranium.app.mjs";

export default {
  key: "figranium-update-task",
  name: "Update Task",
  description: "Update fields on an existing task. [See the documentation](https://figranium.com/docs/api-authentication-and-secure-access).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    taskId: {
      propDefinition: [
        app,
        "taskId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Descriptive name of the automation task",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "Initial URL to navigate to when the task starts",
      optional: true,
    },
    mode: {
      propDefinition: [
        app,
        "mode",
      ],
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the task",
      optional: true,
    },
    selector: {
      type: "string",
      label: "Selector",
      description: "CSS selector to wait for before starting actions",
      optional: true,
    },
    wait: {
      type: "integer",
      label: "Wait (Seconds)",
      description: "Delay after navigation/page loads",
      optional: true,
    },
    actions: {
      type: "string[]",
      label: "Actions",
      description: "Sequential action step objects, e.g. `{ \"type\": \"click\", \"selector\": \"#submit\" }`. Add one JSON object per entry.",
      optional: true,
    },
    variables: {
      type: "object",
      label: "Variables",
      description: "Object of task variable definitions, e.g. `{ \"name\": { \"type\": \"string\", \"value\": \"foo\" } }`",
      optional: true,
    },
    stealth: {
      type: "object",
      label: "Stealth",
      description: "Stealth/anti-bot config object, e.g. `{ \"allowTypos\": true, \"cursorGlide\": true }`",
      optional: true,
    },
    extractionFormat: {
      type: "string",
      label: "Extraction Format",
      description: "Format of the extracted data",
      optional: true,
      options: [
        "json",
        "csv",
      ],
    },
    extractionScript: {
      type: "string",
      label: "Extraction Script",
      description: "Optional post-execution script to extract data",
      optional: true,
    },
    includeHtml: {
      type: "boolean",
      label: "Include HTML",
      description: "Whether to include the page HTML in the execution result",
      optional: true,
    },
    includeShadowDom: {
      type: "boolean",
      label: "Include Shadow DOM",
      description: "Whether to include shadow DOM content when extracting the page",
      optional: true,
    },
    humanTyping: {
      type: "boolean",
      label: "Human Typing",
      description: "Whether to simulate human-like typing",
      optional: true,
    },
    disableRecording: {
      type: "boolean",
      label: "Disable Recording",
      description: "Whether to disable session recording",
      optional: true,
    },
    statelessExecution: {
      type: "boolean",
      label: "Stateless Execution",
      description: "Whether to run the task without persisting browser state between runs",
      optional: true,
    },
    rotateProxies: {
      type: "boolean",
      label: "Rotate Proxies",
      description: "Whether to rotate proxies between requests",
      optional: true,
    },
    rotateUserAgents: {
      type: "boolean",
      label: "Rotate User Agents",
      description: "Whether to rotate user agents between requests",
      optional: true,
    },
    rotateViewport: {
      type: "boolean",
      label: "Rotate Viewport",
      description: "Whether to rotate the browser viewport size",
      optional: true,
    },
    cabinetId: {
      type: "string",
      label: "Cabinet ID",
      description: "Cabinet used for intercepted downloads and Upload actions that omit their own Cabinet ID. Leave blank to use the default Cabinet.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      taskId,
      name,
      url,
      mode,
      description,
      selector,
      wait,
      actions,
      variables,
      stealth,
      extractionFormat,
      extractionScript,
      includeHtml,
      includeShadowDom,
      humanTyping,
      disableRecording,
      statelessExecution,
      rotateProxies,
      rotateUserAgents,
      rotateViewport,
      cabinetId,
    } = this;

    const parsedActions = actions?.map((action) => {
      try {
        return JSON.parse(action);
      } catch {
        throw new ConfigurationError(`Invalid JSON in **Actions** entry: ${action}`);
      }
    });

    const response = await app.updateTask({
      $,
      taskId,
      data: {
        name,
        url,
        mode,
        description,
        selector,
        wait,
        actions: parsedActions,
        variables,
        stealth,
        extractionFormat,
        extractionScript,
        includeHtml,
        includeShadowDom,
        humanTyping,
        disableRecording,
        statelessExecution,
        rotateProxies,
        rotateUserAgents,
        rotateViewport,
        cabinetId,
      },
    });

    $.export("$summary", `Successfully updated task \`${taskId}\`.`);
    return response;
  },
};
