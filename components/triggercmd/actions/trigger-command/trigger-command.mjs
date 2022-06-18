import triggercmd from "../../triggercmd.app.mjs";
import axios from "axios";

export default {
  name: "Trigger a command",
  version: "0.0.12",
  key: "trigger-command",
  description: "Runs a command on a computer.  Refer to the [TRIGGERcmd Forum](https://triggercmd.com/forum) to learn more.",
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
  type: "action",
  methods: {},
  async run() {
    // Make an HTTP POST request using axios
    const resp = await axios({
      method: "POST",
      url: `https://www.triggercmd.com/api/run/triggerSave`,
      data: {
        token: this.token,
        computer: this.computer,
        trigger: this.trigger,
        params: this.params
      },
    });

    // Retrieve just the data from the response
    const { data } = resp;
    console.log(data)
  },
};
