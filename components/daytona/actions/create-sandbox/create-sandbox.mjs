import daytona from "../../daytona.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "daytona-create-sandbox",
  name: "Create Sandbox",
  description: "Creates a new sandbox on Daytona. [See the documentation](https://www.daytona.io/docs/en/typescript-sdk/daytona/#create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    daytona,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the Sandbox",
      optional: true,
    },
    snapshotId: {
      propDefinition: [
        daytona,
        "snapshotId",
      ],
      optional: true,
    },
    autoArchiveInterval: {
      type: "integer",
      label: "Auto Archive Interval",
      description: "Auto-archive interval in minutes (0 means the maximum interval will be used). Default is 7 days.",
      optional: true,
    },
    autoDeleteInterval: {
      type: "integer",
      label: "Auto Delete Interval",
      description: "Auto-delete interval in minutes (negative value means disabled, 0 means delete immediately upon stopping). By default, auto-delete is disabled.",
      optional: true,
    },
    autoStopInterval: {
      type: "integer",
      label: "Auto Stop Interval",
      description: "Auto-stop interval in minutes (0 means disabled). Default is 15 minutes.",
      optional: true,
    },
    envVars: {
      type: "object",
      label: "Environment Variables",
      description: "Optional environment variables to set in the Sandbox",
      optional: true,
    },
    ephemeral: {
      type: "boolean",
      label: "Ephemeral",
      description: "Whether the Sandbox should be ephemeral. If true, autoDeleteInterval will be set to 0",
      optional: true,
    },
    labels: {
      type: "object",
      label: "Labels",
      description: "Labels to set on the Sandbox. Example: { 'my-label': 'my-value' }",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Programming language for direct code execution. Defaults to “python” if not specified.",
      optional: true,
      options: [
        "python",
        "javascript",
        "typescript",
      ],
    },
    networkAllowList: {
      type: "string[]",
      label: "Network Allow List",
      description: "Comma-separated list of allowed CIDR network addresses for the Sandbox",
      optional: true,
    },
    networkBlockAll: {
      type: "boolean",
      label: "Network Block All",
      description: "Whether to block all network access for the Sandbox",
      optional: true,
    },
    public: {
      type: "boolean",
      label: "Public",
      description: "Is the Sandbox port preview public?",
      optional: true,
    },
    user: {
      type: "string",
      label: "User",
      description: "Optional os user to use for the Sandbox",
      optional: true,
    },
    volumes: {
      type: "object",
      label: "Volumes",
      description: "Optional array of volumes to mount to the Sandbox. [See the documentation](https://www.daytona.io/docs/en/typescript-sdk/daytona/#volumemount) for more details.",
      optional: true,
    },
    timeout: {
      propDefinition: [
        daytona,
        "timeout",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      name: this.name,
      snapshotId: this.snapshotId,
      autoArchiveInterval: this.autoArchiveInterval,
      autoDeleteInterval: this.autoDeleteInterval,
      autoStopInterval: this.autoStopInterval,
      envVars: parseObject(this.envVars),
      ephemeral: this.ephemeral,
      labels: parseObject(this.labels),
      language: this.language,
      networkAllowList: this.networkAllowList,
      networkBlockAll: this.networkBlockAll,
      public: this.public,
      user: this.user,
      volumes: parseObject(this.volumes),
    };
    const options = {
      timeout: this.timeout,
    };
    const response = await this.daytona.createSandbox(params, options);
    $.export("$summary", `Successfully created sandbox with ID ${response.id}`);
    return response;
  },
};
