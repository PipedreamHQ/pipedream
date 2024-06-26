import vivomeetings from "../../vivomeetings.app.mjs";

export default {
  key: "vivomeetings-get-conference-recordings",
  name: "Get Conference Recordings",
  description: "Fetches the recordings of a conference or webinar from VivoMeetings. [See the documentation](https://docs.google.com/viewerng/viewer?url=https://vivomeetings.com/wp-content/uploads/2023/01/Partner-APIs-v1.41.docx-1.pdf)",
  version: "0.0.1",
  type: "action",
  props: {
    vivomeetings,
    hostId: {
      propDefinition: [
        vivomeetings,
        "hostId",
      ],
    },
    conferenceId: {
      propDefinition: [
        vivomeetings,
        "conferenceId",
        ({ hostId }) => ({
          hostId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { recordings } = await this.vivomeetings.getConferenceDetails({
      $,
      data: {
        conference_id: this.conferenceId,
      },
    });
    $.export("$summary", `Successfully fetched recordings for conference ID: ${this.conferenceId}`);
    return recordings;
  },
};
