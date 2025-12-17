import triggercmd from "../../triggercmd.app.mjs";

export default {
  name: "Trigger a command",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "triggercmd-trigger-command",
  description: "Runs a command on a computer. Refer to the [TRIGGERcmd Forum](https://triggercmd.com/forum) to learn more.",
  type: "action",
  props: {
    triggercmd,
    computer: {
      type: "string",
      label: "Computer Name",
      description: "The name of the computer",
    },
    trigger: {
      type: "string",
      label: "Trigger Name",
      description: "The name of the command trigger",
    },
    params: {
      type: "string",
      label: "Command parameters",
      description: "Parameters for your command",
      optional: true,
    },
  },
  async run({ $ }) {
    const message = await this.triggercmd.trigger(this.computer, this.trigger, this.params, $);

    $.export("$summary", "Successfully triggered comand");

    return message;
  },

};
