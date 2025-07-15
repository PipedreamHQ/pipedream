import chattermill from "../../chattermill.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "chattermill-new-response-created",
  name: "New Response Created",
  description: "Emit new event when a new response is created. [See the documentation](https://apidocs.chattermill.com/#3dd30375-7956-b872-edbd-873eef126b2d)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    chattermill,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        chattermill,
        "projectId",
      ],
    },
  },
  async run() {

  },
};
