import app from "../../livestorm.app.mjs";

export default {
  key: "livestorm-create-event",
  name: "Create Event",
  description: "Create a new event or duplicate an existing one. [See the Documentation](https://developers.livestorm.co/reference/post_events)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    ownerId: {
      propDefinition: [
        app,
        "ownerId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the event.",
    },
  },
  methods: {
    createEvent(args = {}) {
      return this.app.post({
        path: "/events",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      ownerId,
      title,
    } = this;

    const response = await this.createEvent({
      step,
      data: {
        type: "events",
        attributes: {
          owner_id: ownerId,
          title,
        },
        relationships: {
          sessions: [
            {
              type: "sessions",
              attributes: {
                estimated_started_at: Math.floor(Date.now() / 1000),
                timezone: "UTC",
              },
            },
          ],
        },
      },
    });

    step.export("$summary", `Successfully created event with ID ${response.data.id}`);

    return response;
  },
};
