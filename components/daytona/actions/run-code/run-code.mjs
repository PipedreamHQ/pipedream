import daytona from "../../daytona.app.mjs";

export default {
  key: "daytona-run-code",
  name: "Run Code",
  description: "Execute code in a Daytona sandbox using the appropriate language runtime. Supports Python, TypeScript, and JavaScript. [See the documentation](https://www.daytona.io/docs/en/typescript-sdk/process/#coderun)",
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
    code: {
      type: "string",
      label: "Code",
      description: "The code to execute in the sandbox. E.g. `print('Hello, World!')` for Python or `console.log('Hello, World!')` for JavaScript/TypeScript.",
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Maximum time in seconds to wait for the code to complete. 0 means wait indefinitely.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.daytona.runCode(
      this.sandboxId,
      this.code,
      undefined,
      this.timeout,
    );
    $.export("$summary", "Successfully executed code in sandbox");
    return response;
  },
};
