import { paginate } from "../../common/pagination.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "List Webinar Participants",
  description: "Use this API to list all the participants who attended a webinar hosted in the past. [See the documentation](https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/listWebinarParticipants)",
  key: "zoom_admin-list-webinar-participants",
  version: "0.2.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const data = await paginate(
      this.zoomAdmin.listWebinarParticipants,
      "participants",
      this.webinar?.value ?? this.webinar,
    );

    $.export("$summary", `Successfully fetched webinar with ${data.length} participant(s)`);
    return data;
  },
};
