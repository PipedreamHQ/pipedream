import ssh from "../../ssh.app.mjs";

export default {
  type: "action",
  key: "ssh-execute-command",
  name: "Execute a Command",
  description: "Executes a command on a remote device. [See SSH lib docs here](https://www.npmjs.com/package/node-ssh)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ssh,
    command: {
      label: "Command",
      description: "Command that will be executed",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.ssh.executeCommand({
      command: this.command,
    });

    $.export("$summary", "Successfully executed command");

    return response;
  },
};
