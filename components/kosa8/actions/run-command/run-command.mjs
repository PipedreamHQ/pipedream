import kosa8 from "../../kosa8.app.mjs";

export default {
  key: "kosa8-run-command",
  name: "Run Command",
  description: "Run a shell command in a kosa8 Cloud sandbox and return its exit code, stdout and stderr. A sleeping sandbox wakes first. [See the documentation](https://docs.kosa8.com/guides/cloud-openapi/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    kosa8,
    sandboxId: {
      propDefinition: [
        kosa8,
        "sandboxId",
      ],
    },
    command: {
      type: "string",
      label: "Command",
      description: "The shell command to run, passed to `sh -c`. e.g. `python3 -c 'print(1 + 1)'`",
    },
    env: {
      type: "object",
      label: "Environment Variables",
      description: "Environment variables for the command, as a JSON object of name/value pairs (not an array of `NAME=value` strings), e.g. `{\"MODE\":\"test\",\"DEBUG\":\"1\"}`",
      optional: true,
    },
  },
  async run({ $ }) {
    const env = Object.entries(this.env || {}).map(([
      name,
      value,
    ]) => `${name}=${value}`);
    const response = await this.kosa8.runCommand({
      $,
      sandboxId: this.sandboxId,
      data: {
        cmd: [
          "sh",
          "-c",
          this.command,
        ],
        ...(env.length && {
          env,
        }),
      },
    });
    $.export("$summary", `Command exited with code ${response.exit} in sandbox ${this.sandboxId}`);
    return response;
  },
};
