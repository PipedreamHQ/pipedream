import app from "../../livestorm.app.mjs";

export default {
  key: "livestorm-create-event",
  name: "Create Event",
  description: "Create a new event. [See the Documentation](https://developers.livestorm.co/reference/post_events)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    ownerId: {
      label: "Owner ID",
      description: "The ID of the user who owns the event.",
      propDefinition: [
        app,
        "userId",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    slug: {
      optional: true,
      propDefinition: [
        app,
        "slug",
      ],
    },
    status: {
      optional: true,
      propDefinition: [
        app,
        "status",
      ],
    },
    description: {
      optional: true,
      propDefinition: [
        app,
        "description",
      ],
    },
    recordingEnabled: {
      optional: true,
      propDefinition: [
        app,
        "recordingEnabled",
      ],
    },
    chatEnabled: {
      optional: true,
      propDefinition: [
        app,
        "chatEnabled",
      ],
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
      slug,
      status,
      description,
      recordingEnabled,
      chatEnabled,
    } = this;

    const response = await this.createEvent({
      step,
      data: {
        data: {
          type: "events",
          attributes: {
            title,
            owner_id: ownerId,
            slug,
            status,
            description,
            recording_enabled: recordingEnabled,
            chat_enabled: chatEnabled,
          },
        },
      },
    });

    step.export("$summary", `Successfully created event with ID ${response.data.id}`);

    return response;
  },
};
