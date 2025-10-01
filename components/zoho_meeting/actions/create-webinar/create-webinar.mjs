import app from "../../zoho_meeting.app.mjs";

export default {
  name: "Create Webinar",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "zoho_meeting-create-webinar",
  description: "Creates a webinar. [See the documentation](https://www.zoho.com/meeting/api-integration/webinar-api/create-a-webinar.html)",
  type: "action",
  props: {
    app,
    topic: {
      label: "Topic",
      description: "The topic of the webinar",
      type: "string",
    },
    agenda: {
      label: "Agenda",
      description: "The agenda of the webinar",
      type: "string",
      optional: true,
    },
    duration: {
      label: "Duration",
      description: "The duration of the webinar",
      type: "integer",
      optional: true,
    },
    participants: {
      label: "Participant's Email",
      description: "The participant's email of the webinar. E.g. `pipedream@pipedream.com`",
      type: "string[]",
      optional: true,
    },
  },
  async run({ $ }) {
    const participants = typeof this.participants === "string"
      ? JSON.parse(this.participants)
      : this.participants ?? [];

    const response = await this.app.createWebinar({
      $,
      data: {
        session: {
          topic: this.topic,
          agenda: this.agenda,
          duration: this.duration,
          participants: participants.map((participant) => ({
            email: participant,
          })),
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully created webinar with webinar key ${response.session.webinarKey}`);
    }

    return response;
  },
};
