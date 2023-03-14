import zoomAdmin from "../../zoom_admin.app.mjs";
import get from "lodash/get.js";
import { axios } from "@pipedream/platform";

export default {
  name: "Get Webinar Participant Reports",
  description: "Use this API to get a detailed report on each webinar attendee. You can get webinar participant reports for the last 6 months. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/reportWebinarParticipants)",
  key: "zoom_admin-get-webinar-participant-reports",
  version: "0.0.1",
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
    const res = await this.app.getWebinarParticipantReports(
      this.webinarId
    );

    console.log(res);
    return res;
  },
};
