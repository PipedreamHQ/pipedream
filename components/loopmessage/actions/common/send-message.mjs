import app from "../../loopmessage.app.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    app,
    recipient: {
      propDefinition: [
        app,
        "recipient",
      ],
    },
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
    senderName: {
      optional: true,
      propDefinition: [
        app,
        "senderName",
      ],
    },
    statusCallback: {
      propDefinition: [
        app,
        "statusCallback",
      ],
    },
    statusCallbackHeader: {
      propDefinition: [
        app,
        "statusCallbackHeader",
      ],
    },
  },
  methods: {
    getSummary() {
      throw new ConfigurationError("The `getSummary` method is not implemented.");
    },
  },
  async run({ $: step }) {
    const {
      app,
      getSummary,
      ...data
    } = this;

    const response = await app.sendMessage({
      step,
      data: utils.keysToSnakeCase(data),
    });

    step.export("$summary", getSummary(response));

    return response;
  },
};
