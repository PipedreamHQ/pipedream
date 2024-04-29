import reishost from "../../reishost.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "reishost-send-console-command",
  name: "Send Console Command",
  description: "Runs a command on your server's console, providing direct command execution flexibility.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    reishost,
    command: {
      propDefinition: [
        reishost,
        "command",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.reishost.sendCommand({
      command: this.command,
    });
    $.export("$summary", `Successfully executed command: ${this.command}`);
    return response;
  },
};
