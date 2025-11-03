import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import isArray from "lodash/isArray.js";
import { doubleEncode } from "../../common/utils.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "Add webinar registrant",
  description: "Register a participant for a webinar. [See the documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarregistrantcreate)",
  key: "zoom_admin-add-webinar-registrant",
  version: "0.1.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
      type: "string[]",
      description: "The [webinar occurrence ID](https://support.zoom.us/hc/en-us/articles/216354763-How-to-Schedule-A-Recurring-Webinar).",
    },
    email: {
      type: "string",
      label: "Email",
      description: "A valid email address of the registrant",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Registrant's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Registrant's last name",
    },
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "POST",
      path: `/webinars/${doubleEncode(get(this.webinar, "value", this.webinar))}/registrants`,
      params: {
        occurrence_ids: isArray(this.occurrence)
          ? this.occurrence.map((occurrence) => get(occurrence, "value", occurrence)).join(",")
          : this.occurrence,
      },
      data: {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
      },
    }));

    if (this.occurrence) {
      const occurrences = this.occurrence.map((occurrence) => get(occurrence, "label", occurrence)).join(",");
      $.export("$summary", `"${this.firstName} ${this.lastName}" was successfully invited to the occurrence(s) "${occurrences}" of the webinar "${get(this.webinar, "label", this.webinar)}"`);
    } else {
      $.export("$summary", `"${this.firstName} ${this.lastName}" was successfully invited to the webinar, "${get(this.webinar, "label", this.webinar)}"`);
    }

    return res;
  },
};
