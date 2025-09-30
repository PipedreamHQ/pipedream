import reishost from "../../reishost.app.mjs";

export default {
  key: "reishost-send-console-command",
  name: "Send Console Command",
  description: "Runs a command on your server's console, providing direct command execution flexibility.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    reishost,
    serverId: {
      type: "string",
      label: "Server Id",
      description: "The server's identifier.",
    },
    command: {
      type: "string",
      label: "Command",
      description: "The command you want to execute on the server.",
    },
  },
  async run({ $ }) {
    const response = await this.reishost.sendCommand({
      serverId: this.serverId,
      data: {
        command: this.command,
      },
    });

    $.export("$summary", "Command successfully executed!");
    return response;
  },
};
