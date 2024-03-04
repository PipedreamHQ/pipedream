import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import _twocaptcha from "../../_twocaptcha.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "_twocaptcha-captcha-solved",
  name: "New Captcha Solved",
  description: "Emit new event when a captcha has been successfully solved by the 2Captcha service.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    _twocaptcha,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the captcha task you want to get the result for.",
    },
  },
  methods: {
    generateMeta() {
      const ts = Date.now();
      return {
        id: `${this.taskId}-${ts}`,
        summary: "Chaptcha successfully solved!",
        ts,
      };
    },
    async startEvent() {
      let response = await this._twocaptcha.getTaskResult({
        data: {
          taskId: this.taskId,
        },
      });

      if (response.status && response.status === "ready") {
        this.$emit(response, this.generateMeta(response));
      }
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
