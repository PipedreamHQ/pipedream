import vivomeetings from "../../vivomeetings.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vivomeetings-create-meeting",
  name: "Create Meeting",
  description: "Creates a new meeting in VivoMeetings. [See the documentation](https://vivomeetings.com/api-developer-guide/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    vivomeetings,
    title: {
      propDefinition: [
        vivomeetings,
        "title",
      ],
    },
    startTime: {
      propDefinition: [
        vivomeetings,
        "startTime",
      ],
    },
    endTime: {
      propDefinition: [
        vivomeetings,
        "endTime",
      ],
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
    const response = await this.vivomeetings.createMeeting({
      title: this.title,
      startTime: this.startTime,
      endTime: this.endTime,
      attendees: this.attendees,
      description: this.description,
    });

    $.export("$summary", `Meeting "${this.title}" created successfully`);
    return response;
  },
};
