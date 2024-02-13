import _twocaptcha from "../../_twocaptcha.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "_twocaptcha-submit-captcha",
  name: "Submit Captcha for Solving",
  description: "Send a new captcha to the 2Captcha service for solving. Required props are clientKey and task object.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    _twocaptcha,
    clientKey: {
      propDefinition: [
        _twocaptcha,
        "clientKey",
      ],
    },
    task: {
      propDefinition: [
        _twocaptcha,
        "task",
      ],
    },
  },
  async run({ $ }) {
    const response = await this._twocaptcha.createTask({
      clientKey: this.clientKey,
      task: this.task,
    });

    $.export("$summary", `Successfully submitted captcha with task ID ${response.taskId}`);
    return response;
  },
};
