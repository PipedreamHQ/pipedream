import triggercmd from "../../triggercmd.app.mjs";

export default {
  name: "Trigger a command",
  version: "0.0.26",
  key: "trigger-command",
  description: "Runs a command on a computer.  Refer to the [TRIGGERcmd Forum](https://triggercmd.com/forum) to learn more.",
  type: "action",
  props: {
    token: {
      type: "string",
      label: "Token from the Instructions page in your account at TRIGGERcmd.com",
      secret: true
    },
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
    const message = await triggercmd.methods.trigger(this.token, this.computer, this.trigger, this.params, $);
    return message;
  },

};
