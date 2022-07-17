import triggercmd from "../../triggercmd.app.mjs";

export default {
  name: "Trigger a command",
  version: "0.0.38",
  key: "trigger-command",
  description: "Runs a command on a computer.  Refer to the [TRIGGERcmd Forum](https://triggercmd.com/forum) to learn more.",
  type: "action",
  props: {
    triggercmd,
    computer: {
      type: "string",
      label: "Computer Name",
    },
    trigger: {
      type: "string",
      label: "Trigger Name",
    },
    params: {
      type: "string",
      label: "Command parameters",
      optional: true
    }
  },
  async run({ $ }) {
    const message = await this.triggercmd.trigger(this.computer, this.trigger, this.params, $);
    return message;
  },

};
