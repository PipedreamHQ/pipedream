import vivomeetings from "../../vivomeetings.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vivomeetings-update-conference",
  name: "Update Conference",
  description: "Updates an existing conference or webinar on VivoMeetings. [See the documentation](https://vivomeetings.com/api-developer-guide/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    vivomeetings,
    conferenceId: {
      propDefinition: [
        vivomeetings,
        "conferenceId",
      ],
    },
    title: {
      propDefinition: [
        vivomeetings,
        "title",
      ],
      optional: true,
    },
    startTime: {
      propDefinition: [
        vivomeetings,
        "startTime",
      ],
      optional: true,
    },
    endTime: {
      propDefinition: [
        vivomeetings,
        "endTime",
      ],
      optional: true,
    },
    attendees: {
      propDefinition: [
        vivomeetings,
        "attendees",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        vivomeetings,
        "description",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      conferenceId,
      title,
      startTime,
      endTime,
      attendees,
      description,
    } = this;

    const response = await this.vivomeetings.updateConference({
      conferenceId,
      title,
      startTime,
      endTime,
      attendees,
      description,
    });

    $.export("$summary", `Successfully updated the conference with ID ${conferenceId}`);
    return response;
  },
};
