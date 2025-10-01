import { ConfigurationError } from "@pipedream/platform";
import _twocaptcha from "../../_twocaptcha.app.mjs";
import {
  TASK_TYPE_OPTIONS,
  filterProxy,
  taskProps,
} from "../../common/constants.mjs";
import proxy from "../../common/taskProps/proxy.mjs";

export default {
  key: "_twocaptcha-submit-captcha",
  name: "Submit Captcha for Solving",
  description: "Send a new captcha to the 2Captcha service for solving. Required props are clientKey and task object.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    _twocaptcha,
    taskType: {
      type: "string",
      label: "Task Type",
      description: "The type of the task you want to create.",
      reloadProps: true,
      options: TASK_TYPE_OPTIONS,
    },
    languagePool: {
      type: "string",
      label: "Language Pool",
      description: "Used to choose the workers for solving the captcha by their language. Applicable to image-based and text-based captchas.",
      options: [
        "en",
        "rn",
      ],
      optional: true,
    },
    softId: {
      type: "integer",
      label: "Soft Id",
      description: "The ID of your software registered in our [Software catalog](https://2captcha.com/software)",
      optional: true,
    },
  },
  async additionalProps() {
    let props = {};
    if (this.taskType) {
      props = taskProps[this.taskType];

      if ((this.taskType === "geetest") && (this.version === "4")) {
        props.initParameters.optional = false;
      }

      if (this.type && (!filterProxy.includes(this.taskType)) && !this.type.endsWith("Proxyless")) {
        props = {
          ...props,
          ...proxy,
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      _twocaptcha,
      taskType,
      languagePool,
      softId,
      ...task
    } = this;

    if (taskType === "key") {
      task.s_s_c_user_id = task.sscUserId;
      task.s_s_c_session_id = task.sscSessionId;
      task.s_s_c_web_server_sign = task.sscWebServerSign;
      task.s_s_c_web_server_sign2 = task.sscWebServerSign2;
      delete task.sscUserId;
      delete task.sscSessionId;
      delete task.sscWebServerSign;
      delete task.sscWebServerSign2;
    }

    const response = await _twocaptcha.createTask({
      $,
      data: {
        languagePool,
        softId,
        task,
      },
    });

    if (response.errorId) {
      throw new ConfigurationError(response.errorDescription);
    }

    $.export("$summary", `Successfully submitted captcha with task ID ${response.taskId}`);
    return response;
  },
};
