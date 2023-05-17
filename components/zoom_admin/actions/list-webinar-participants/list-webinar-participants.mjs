import zoomAdmin from "../../zoom_admin.app.mjs";
import get from "lodash/get.js";

export default {
  name: "List Webinar Participants",
  description: "Use this API to list all the participants who attended a webinar hosted in the past. [See the documentation](https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/listWebinarParticipants)",
  key: "zoom_admin-list-webinar-participants",
  version: "0.0.3",
  type: "action",
  props: {
    zoomAdmin,
    webinar: {
      propDefinition: [
        zoomAdmin,
        "webinar",
      ],
    },
  },
  async run ({ $ }) {
    const data = [];

    let nextPageToken;
    do {
      const res = await this.zoomAdmin.listWebinarParticipants(
        get(this.webinar, "value", this.webinar),
        nextPageToken,
      );
      data.push(...res.participants);
      nextPageToken = res.next_page_token;
    } while (nextPageToken);

    $.export("$summary", `Successfully fetched webinar with ${data.length} participant(s)`);
    return data;
  },
};
