import _twocaptcha from "../../_twocaptcha.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "_twocaptcha-retrieve-solution",
  name: "Retrieve Captcha Solution",
  description: "Fetch the solution of a previously submitted captcha from the 2Captcha service.",
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
    taskId: {
      propDefinition: [
        _twocaptcha,
        "taskId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this._twocaptcha.getTaskResult({
      clientKey: this.clientKey,
      taskId: this.taskId,
    });

    if (response.status === "ready") {
      $.export("$summary", "Successfully retrieved the captcha solution");
      return response.solution;
    } else {
      throw new Error("Captcha solution is not ready yet. Please try again later.");
    }
  },
};
