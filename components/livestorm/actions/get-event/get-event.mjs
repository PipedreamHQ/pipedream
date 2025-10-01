import app from "../../livestorm.app.mjs";

export default {
  key: "livestorm-get-event",
  name: "Get Event",
  description: "Retrieve a single event. [See the Documentation](https://developers.livestorm.co/reference/get_events-id)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    eventId: {
      propDefinition: [
        app,
        "eventId",
      ],
    },
  },
  async run({ $: step }) {
    const response = await this.app.getEvent({
      eventId: this.eventId,
    });

    step.export("$summary", `Successfully retrieved event with ID ${response.data.id}.`);

    return response;
  },
};
