import zoomAdmin from "../../zoom_admin.app.mjs";
import get from "lodash/get.js";
import consts from "../../consts.mjs";
import { axios } from "@pipedream/platform";

export default {
  name: "List webinar registrants",
  description: "List all users that have registered for a webinar. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarregistrants)",
  key: "zoom_admin-action-list-webinar-registrants",
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
    occurrence: {
      propDefinition: [
        zoomAdmin,
        "occurrence",
        ({ webinar }) => ({
          meeting: webinar,
          isWebinar: true,
        }),
      ],
    },
    status: {
      type: "string",
      label: "Registrant status",
      description: "Defaults to `approved`",
      optional: true,
      options: consts.REGISTRANT_STATUSES_OPTIONS,
    },
    trackingSourceId: {
      type: "string",
      label: "Tracking Source ID",
      description: "This filter can be useful if you share the webinar registration page in multiple locations. See [Creating source tracking links for webinar registration](https://support.zoom.us/hc/en-us/articles/360000315683-Creating-source-tracking-links-for-webinar-registration) for details.",
      optional: true,
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
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "GET",
      path: `/webinars/${get(this.webinar, "value", this.webinar)}/registrants`,
      params: {
        occurrence_id: get(this.occurrence, "value", this.occurrence),
        status: this.status,
        tracking_source_id: this.trackingSourceId,
        page_size: this.pageSize,
        page_number: this.pageNumber,
        next_page_token: this.nextPageToken,
      },
    }));

    if (this.occurrence) {
      $.export("$summary", `Registrants for the occurrence "${get(this.occurrence, "label", this.occurrence)}" of the webinar "${get(this.webinar, "label", this.webinar)}" successfully fetched`);
    } else {
      $.export("$summary", `Registrants for the webinar "${get(this.webinar, "label", this.webinar)}" successfully fetched`);
    }

    return res;
  },
};
