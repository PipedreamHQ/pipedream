import app from "../../livestorm.app.mjs";

export default {
  key: "livestorm-update-event",
  name: "Update Event",
  description: "Update an event with its full list of attributes. [See the Documentation](https://developers.livestorm.co/reference/put_events-id)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    eventId: {
      propDefinition: [
        app,
        "eventId",
      ],
    },
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
      propDefinition: [
        app,
        "slug",
      ],
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    recordingEnabled: {
      propDefinition: [
        app,
        "recordingEnabled",
      ],
    },
    chatEnabled: {
      propDefinition: [
        app,
        "chatEnabled",
      ],
    },
    everyoneCanSpeak: {
      propDefinition: [
        app,
        "everyoneCanSpeak",
      ],
    },
    detailedRegistrationPageEnabled: {
      propDefinition: [
        app,
        "detailedRegistrationPageEnabled",
      ],
    },
    lightRegistrationPageEnabled: {
      propDefinition: [
        app,
        "lightRegistrationPageEnabled",
      ],
    },
    recordingPublic: {
      propDefinition: [
        app,
        "recordingPublic",
      ],
    },
    showInCompanyPage: {
      propDefinition: [
        app,
        "showInCompanyPage",
      ],
    },
    pollsEnabled: {
      propDefinition: [
        app,
        "pollsEnabled",
      ],
    },
    questionsEnabled: {
      propDefinition: [
        app,
        "questionsEnabled",
      ],
    },
  },
  methods: {
    updateEvent({
      eventId, ... args
    } = {}) {
      return this.app.put({
        path: `/events/${eventId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      eventId,
      ownerId,
      title,
      slug,
      status,
      description,
      recordingEnabled,
      chatEnabled,
      everyoneCanSpeak,
      detailedRegistrationPageEnabled,
      lightRegistrationPageEnabled,
      recordingPublic,
      showInCompanyPage,
      pollsEnabled,
      questionsEnabled,
    } = this;

    const response = await this.updateEvent({
      eventId,
      data: {
        data: {
          type: "events",
          attributes: {
            owner_id: ownerId,
            title,
            slug,
            status,
            description,
            recording_enabled: recordingEnabled,
            chat_enabled: chatEnabled,
            everyone_can_speak: everyoneCanSpeak,
            detailed_registration_page_enabled: detailedRegistrationPageEnabled,
            light_registration_page_enabled: lightRegistrationPageEnabled,
            recording_public: recordingPublic,
            show_in_company_page: showInCompanyPage,
            polls_enabled: pollsEnabled,
            questions_enabled: questionsEnabled,
          },
        },
      },
    });

    step.export("$summary", `Successfully updated event with ID ${response.data.id}.`);

    return response;
  },
};
