import _twocaptcha from "../../_twocaptcha.app.mjs";

export default {
  key: "_twocaptcha-retrieve-solution",
  name: "Retrieve Captcha Solution",
  description: "Fetch the solution of a previously submitted captcha from the 2Captcha service.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    _twocaptcha,
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the captcha task you want to get the result for.",
    },
  },
  async run({ $ }) {
    const response = await this._twocaptcha.getTaskResult({
      $,
      data: {
        taskId: this.taskId,
      },
    });

    $.export("$summary", "Successfully retrieved the captcha solution");
    return response;
  },
};
