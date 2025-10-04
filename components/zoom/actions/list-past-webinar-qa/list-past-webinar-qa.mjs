// legacy_hash_id: a_67iQp1
import { axios } from "@pipedream/platform";

export default {
  key: "zoom-list-past-webinar-qa",
  name: "List Past Webinar Q&A",
  description: "The  feature for Webinars allows attendees to ask questions during the Webinar and for the panelists, co-hosts and host to answer their questions. Use this API to list Q&A of a specific Webinar.",
  version: "0.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zoom: {
      type: "app",
      app: "zoom",
    },
    webinarID: {
      type: "string",
      label: "Webinar ID",
      description: "The Zoom Webinar ID of the webinar you'd like to update.",
    },
  },
  async run({ $ }) {
    const config = {
      url: `https://api.zoom.us/v2/past_webinars/${this.webinarID}/qa`,
      headers: {
        Authorization: `Bearer ${this.zoom.$auth.oauth_access_token}`,
      },
    };

    return await axios($, config);
  },
};
