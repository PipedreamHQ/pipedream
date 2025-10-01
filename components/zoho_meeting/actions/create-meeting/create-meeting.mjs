import app from "../../zoho_meeting.app.mjs";

export default {
  name: "Create Meeting",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "zoho_meeting-create-meeting",
  description: "Creates a meeting. [See the documentation](https://www.zoho.com/meeting/api-integration/meeting-api/create-a-meeting.html)",
  type: "action",
  props: {
    app,
    topic: {
      label: "Topic",
      description: "The topic of the meeting",
      type: "string",
    },
    agenda: {
      label: "Agenda",
      description: "The agenda of the meeting",
      type: "string",
      optional: true,
    },
    duration: {
      label: "Duration",
      description: "The duration of the meeting",
      type: "integer",
      optional: true,
    },
    participants: {
      label: "Participant's Email",
      description: "The participant's email of the meeting. E.g. `pipedream@pipedream.com`",
      type: "string[]",
      optional: true,
    },
  },
  async run({ $ }) {
    const participants = typeof this.participants === "string"
      ? JSON.parse(this.participants)
      : this.participants ?? [];

    const response = await this.app.createMeeting({
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
      $.export("$summary", `Successfully created meeting with meeting key ${response.session.meetingKey}`);
    }

    return response;
  },
};
