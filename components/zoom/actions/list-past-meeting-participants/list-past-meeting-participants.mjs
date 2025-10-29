import app from "../../zoom.app.mjs";

export default {
  key: "zoom-list-past-meeting-participants",
  name: "List Past Meeting Participants",
  description: "Retrieve information on participants from a past meeting. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/pastMeetingParticipants).",
  version: "0.2.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    meetingId: {
      propDefinition: [
        app,
        "meetingId",
      ],
    },
  },
  methods: {
    listPastMeetingParticipants({
      meetingId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/past_meetings/${meetingId}/participants`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const { participants } = await this.listPastMeetingParticipants({
      step,
      meetingId: this.meetingId,
    });

    step.export("$summary", `Successfully retrieved ${participants.length} past meeting participants`);

    return participants;
  },
};
