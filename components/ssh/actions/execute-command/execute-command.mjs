import ssh from "../../ssh.app.mjs";

export default {
  type: "action",
  key: "ssh-execute-command",
  name: "Execute a Command",
  description: "Executes a command on a remote device. [See SSH lib docs here](https://www.npmjs.com/package/node-ssh)",
  version: "0.0.3",
  props: {
    ssh,
    command: {
      label: "Command",
      description: "Command that will be executed",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.ssh.executeCommand(this.command);

    if (response.code === 0) {
      $.export("$summary", "Successfully executed command");
    } else {
      $.export("$summary", `Command resulted in status code ${response.code}`);
      console.log(`signal: ${response.signal}`);
      console.log(`stderr: ${response.stderr}`);
    }

    console.log(`stdout: ${response.stdout}`);
    return response;
  },
};
