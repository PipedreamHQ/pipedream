import app from "../../webinarkit.app.mjs";

export default {
  key: "webinarkit-list-scheduled-sessions",
  name: "List Scheduled Sessions",
  description: "Lists all scheduled sessions for a specific webinar. [See the documentation](https://documenter.getpostman.com/view/22597176/Uzs435mo#033f7d11-dcd3-4130-b41b-7eee4d4f28d1)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    webinarId: {
      propDefinition: [
        app,
        "webinarId",
      ],
    },
  },
  async run({ $: step }) {
    const {
      app,
      webinarId,
    } = this;

    const response = await app.listWebinarDates({
      step,
      webinarId,
    });

    step.export("$summary", `Successfully retrieved ${response.results.length} scheduled sessions.`);

    return response;
  },
};
