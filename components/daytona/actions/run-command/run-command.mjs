import daytona from "../../daytona.app.mjs";

export default {
  key: "daytona-run-command",
  name: "Run Command",
  description: "Execute a shell command in a Daytona sandbox. [See the documentation](https://www.daytona.io/docs/en/typescript-sdk/process/#executecommand)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    daytona,
    sandboxId: {
      propDefinition: [
        daytona,
        "sandboxId",
      ],
    },
    command: {
      type: "string",
      label: "Command",
      description: "The shell command to execute in the sandbox. E.g. `ls -la` or `echo 'Hello World'`",
    },
    cwd: {
      type: "string",
      label: "Working Directory",
      description: "Working directory for command execution. If not specified, uses the sandbox working directory.",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Maximum time in seconds to wait for the command to complete. 0 means wait indefinitely.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.daytona.runCommand(
      this.sandboxId,
      this.command,
      this.cwd,
      this.timeout,
    );
    $.export("$summary", `Successfully executed command in sandbox ${this.sandboxId}`);
    return response;
  },
};
