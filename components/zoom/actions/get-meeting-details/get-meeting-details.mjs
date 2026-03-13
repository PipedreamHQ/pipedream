// legacy_hash_id: a_Xzi12a
import { axios } from "@pipedream/platform";
import utils from "../../common/utils.mjs";

export default {
  key: "zoom-get-meeting-details",
  name: "Get Meeting Details",
  description: "Retrieves the details of a meeting.",
  version: "0.3.7",
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
    meeting_id: {
      type: "integer",
      description: "The meeting ID.",
    },
    occurrence_id: {
      type: "string",
      description: "Meeting occurrence ID.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs here: https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meeting
    const config = {
      url: `https://api.zoom.us/v2/meetings/${utils.doubleEncode(this.meeting_id)}`,
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
