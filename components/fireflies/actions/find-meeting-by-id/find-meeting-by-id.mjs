import fireflies from "../../fireflies.app.mjs";

export default {
  key: "fireflies-find-meeting-by-id",
  name: "Find Meeting by ID",
  description: "Locates a specific user meeting by its unique ID.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fireflies,
    meetingId: {
      type: "string",
      label: "Meeting ID",
      description: "The unique identifier for the meeting.",
    },
  },
  async run({ $ }) {
    const meeting = await this.fireflies.getMeeting(this.meetingId);
    $.export("$summary", `Successfully found meeting with ID: ${this.meetingId}`);
    return meeting;
  },
};
