import daytona from "../../daytona.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "daytona-create-sandbox",
  name: "Create Sandbox",
  description: "Creates a new sandbox on Daytona. Provide a **Snapshot** to create from a pre-built template, an **Image** to create from a custom Docker image, or neither to use the Daytona default snapshot. **Snapshot takes precedence over Image** if both are provided. [See the documentation](https://www.daytona.io/docs/en/typescript-sdk/daytona/#create)",
  version: "0.0.2",
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
      description: "Pre-built snapshot to use as the sandbox base. **Takes precedence over Image if both are provided.** If neither Snapshot nor Image is specified, the Daytona default snapshot is used.",
      optional: true,
    },
    image: {
      type: "string",
      label: "Image",
      description: "Custom Docker image to use for the Sandbox (e.g. `python:3.12-slim`). Only used when no **Snapshot** is specified. Supports public registry images.",
      optional: true,
    },
    cpu: {
      type: "integer",
      label: "CPU",
      description: "Number of CPU cores to allocate (minimum: `1`). Only applies when using a custom **Image**, not a Snapshot.",
      optional: true,
      min: 1,
    },
    memory: {
      type: "integer",
      label: "Memory (GiB)",
      description: "Amount of memory in GiB to allocate (minimum: `1`). Only applies when using a custom **Image**, not a Snapshot.",
      optional: true,
      min: 1,
    },
    disk: {
      type: "integer",
      label: "Disk (GiB)",
      description: "Amount of disk space in GiB to allocate (minimum: `1`). Only applies when using a custom **Image**, not a Snapshot.",
      optional: true,
      min: 1,
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
      description: "Programming language for direct code execution. Defaults to `python` if not specified.",
      optional: true,
      options: [
        "python",
        "javascript",
        "typescript",
      ],
    },
    networkAllowList: {
      type: "string",
      label: "Network Allow List",
      description: "Comma-separated list of allowed CIDR network addresses for the Sandbox (e.g. `10.0.0.0/8,192.168.1.0/24`)",
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
      description: "Optional OS user to use for the Sandbox",
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
    const baseParams = {
      name: this.name,
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

    let params;
    if (this.snapshotId) {
      // Snapshot always wins — image and resources don't apply
      params = {
        ...baseParams,
        snapshot: this.snapshotId,
      };
    } else if (this.image) {
      // Custom image — attach resources only if at least one field is set
      const resources = (this.cpu || this.memory || this.disk)
        ? {
          cpu: this.cpu,
          memory: this.memory,
          disk: this.disk,
        }
        : undefined;
      params = {
        ...baseParams,
        image: this.image,
        resources,
      };
    } else {
      // Neither specified — Daytona uses its default snapshot
      params = baseParams;
    }

    const options = {
      timeout: this.timeout,
    };
    const response = await this.daytona.createSandbox(params, options);
    $.export("$summary", `Successfully created sandbox with ID ${response.id}`);
    return response;
  },
};
