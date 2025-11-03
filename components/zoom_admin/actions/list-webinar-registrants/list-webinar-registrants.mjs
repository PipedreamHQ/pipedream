import { paginate } from "../../common/pagination.mjs";
import consts from "../../consts.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "List webinar registrants",
  description: "List all users that have registered for a webinar. [See the documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarregistrants)",
  key: "zoom_admin-list-webinar-registrants",
  version: "0.2.6",
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
  },
  async run ({ $ }) {
    const params = {
      occurrence_id: this.occurrence?.value ?? this.occurrence,
      status: this.status,
      tracking_source_id: this.trackingSourceId,
    };

    const data = await paginate(
      this.zoomAdmin.listWebinarRegistrants,
      "registrants",
      this.webinar?.value ?? this.webinar,
      params,
    );

    if (this.occurrence) {
      $.export("$summary", `${data.length} Registrant(s) for the occurrence "${this.occurrence?.value ?? this.occurrence}" of the webinar "${this.webinar?.value ?? this.webinar}" successfully fetched`);
    } else {
      $.export("$summary", `${data.length} Registrant(s) for the webinar "${this.webinar?.value ?? this.webinar}" successfully fetched`);
    }

    return data;
  },
};
