// legacy_hash_id: a_WYie0m
import { axios } from "@pipedream/platform";

export default {
  key: "zoom-get-webinar-details",
  name: "Get Webinar Details",
  description: "Gets details of a scheduled webinar.",
  version: "0.2.1",
  type: "action",
  props: {
    zoom: {
      type: "app",
      app: "zoom",
    },
    webinar_id: {
      type: "integer",
      description: "The webinar ID.",
    },
    occurrence_id: {
      type: "string",
      description: "Unique Identifier that identifies an occurrence of a recurring webinar.  Recurring webinars can have a maximum of 50 occurrences.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs here: https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinar
    const config = {
      url: `https://api.zoom.us/v2/webinars/${this.webinar_id}`,
      params: {
        occurrence_id: this.occurrence_id,
      },
      headers: {
        Authorization: `Bearer ${this.zoom.$auth.oauth_access_token}`,
      },
    };
    return await axios($, config);
  },
};
