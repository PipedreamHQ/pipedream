import vivomeetings from "../../vivomeetings.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vivomeetings-get-conference-recordings",
  name: "Get Conference Recordings",
  description: "Fetches the recordings of a conference or webinar from VivoMeetings. [See the documentation](https://vivomeetings.com/api-developer-guide/)",
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
  },
  async run({ $ }) {
    const response = await this.vivomeetings._makeRequest({
      method: "GET",
      path: `/conferences/${this.conferenceId}/recordings`,
    });
    $.export("$summary", `Successfully fetched recordings for conference ID: ${this.conferenceId}`);
    return response;
  },
};
