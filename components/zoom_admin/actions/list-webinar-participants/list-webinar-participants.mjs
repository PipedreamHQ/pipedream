import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "List Webinar Participants",
  description: "Use this API to list all the participants who attended a webinar hosted in the past. [See the documentation](https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/listWebinarParticipants)",
  key: "zoom_admin-list-webinar-participants",
  version: "0.0.2",
  type: "action",
  props: {
    zoomAdmin,
    webinar: {
      propDefinition: [
        zoomAdmin,
        "webinar",
      ],
    },
    pageSize: {
      propDefinition: [
        zoomAdmin,
        "pageSize",
      ],
    },
    nextPageToken: {
      propDefinition: [
        zoomAdmin,
        "nextPageToken",
      ],
    },
  },
  async run ({ $ }) {
    const res = await this.zoomAdmin.listWebinarParticipants(
      this.webinar,
      this.pageSize,
      this.nextPageToken,
    );

    $.export("$summary", `Successfully fetched ${res.participants.length} participant(s)`);
    return res;
  },
};
