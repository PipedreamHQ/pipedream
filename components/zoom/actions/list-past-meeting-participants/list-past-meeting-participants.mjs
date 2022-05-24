// legacy_hash_id: a_YEik5g
import { axios } from "@pipedream/platform";

export default {
  key: "zoom-list-past-meeting-participants",
  name: "List Past Meeting Participants",
  description: "Retrieve information on participants from a past meeting.",
  version: "0.1.1",
  type: "action",
  props: {
    zoom: {
      type: "app",
      app: "zoom",
    },
    meeting_id: {
      type: "string",
    },
  },
  async run({ $ }) {
    const config = {
      url: `https://api.zoom.us/v2/past_meetings/${this.meeting_id}/participants`,
      headers: {
        Authorization: `Bearer ${this.zoom.$auth.oauth_access_token}`,
      },
    };

    const results = await axios($, config);

    return results.participants.filter((element, index) => {
      const _element = JSON.stringify(element);
      return index === results.participants.findIndex((obj) => {
        return JSON.stringify(obj) === _element;
      });
    });
  },
};
