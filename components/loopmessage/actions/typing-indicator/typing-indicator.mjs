import app from "../../loopmessage.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "loopmessage-typing-indicator",
  name: "Show Typing Indicator",
  description: "Action to present a typing indicator or read status",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    messageId: {
      propDefinition: [
        app,
        "messageId",
      ],
    },
  },
  methods: {
    getSummary() {
      return "Request accepted.";
    },
  },
  async run({ $: step }) {
    const {
      app,
      ...data
    } = this;

    const response = await app.sendTyping({
      step,
      data: utils.keysToSnakeCase(data),
    });

    step.export("$summary", this.getSummary(response));

    return response;
  },
};
