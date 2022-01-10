import zoomAdmin from "../../zoom_admin.app.mjs";
import get from "lodash/get.js";
import isArray from "lodash/isArray.js";
import { axios } from "@pipedream/platform";
import consts from "../../consts.mjs";

const {
  PURCHASING_TIME_FRAME_OPTIONS,
  ROLE_IN_PURCHASE_PROCESS_OPTIONS,
  NUMBER_OF_EMPLOYEES_OPTIONS,
} = consts;

export default {
  name: "Add webinar registrant",
  description: "Register a participant for a webinar. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarregistrantcreate)",
  key: "zoom_admin-action-add-webinar-registrant",
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
    // occurrenceId: {
    //   propDefinition: [
    //     zoomAdmin,
    //     "occurrenceId",
    //     ({ webinar }) => ({
    //       meeting: webinar,
    //       isWebinar: true,
    //     }),
    //   ],
    //   type: "string[]",
    //   description: "The [webinar occurrence ID](https://support.zoom.us/hc/en-us/articles/216354763-How-to-Schedule-A-Recurring-Webinar).",
    // },
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
    // address: {
    //   type: "string",
    //   label: "Address",
    //   description: "Registrant's address",
    //   optional: true,
    // },
    // city: {
    //   type: "string",
    //   label: "City",
    //   description: "Registrant's city",
    //   optional: true,
    // },
    // country: {
    //   propDefinition: [
    //     zoomAdmin,
    //     "country",
    //   ],
    // },
    // zip: {
    //   type: "string",
    //   label: "ZIP Code",
    //   description: "Registrant's Zip/Postal Code.",
    //   optional: true,
    // },
    // state: {
    //   type: "string",
    //   label: "State",
    //   description: "Registrant's State/Province.",
    //   optional: true,
    // },
    // phone: {
    //   type: "string",
    //   label: "Phone",
    //   description: "Registrant's Phone number.",
    //   optional: true,
    // },
    // industry: {
    //   type: "string",
    //   label: "Industry",
    //   description: "Registrant's Industry.",
    //   optional: true,
    // },
    // org: {
    //   type: "string",
    //   label: "Organization",
    //   description: "Registrant's Organization.",
    //   optional: true,
    // },
    // jobTitle: {
    //   type: "string",
    //   label: "Job Title",
    //   description: "Registrant's Job Title.",
    //   optional: true,
    // },
    // purchasingTimeFrame: {
    //   type: "string",
    //   label: "Purchasing Time Frame",
    //   description: "This field can be included to gauge interest of webinar attendees towards buying your product or service.",
    //   optional: true,
    //   options: PURCHASING_TIME_FRAME_OPTIONS,
    // },
    // roleInPurchaseProcess: {
    //   type: "string",
    //   label: "Role in Purchase Process",
    //   description: "Role in Purchase Process.",
    //   optional: true,
    //   options: ROLE_IN_PURCHASE_PROCESS_OPTIONS,
    // },
    // numberOfEmployees: {
    //   type: "string",
    //   label: "Number of Employees",
    //   description: "Number of Employees.",
    //   optional: true,
    //   options: NUMBER_OF_EMPLOYEES_OPTIONS,
    // },
    // comments: {
    //   type: "string",
    //   label: "Comments",
    //   description: "A field that allows registrants to provide any questions or comments that they might have.",
    //   optional: true,
    // },
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "POST",
      path: `/webinars/${get(this.webinar, "value", this.webinar)}/registrants`,
      params: {
        occurrence_ids: isArray(this.occurrenceId)
          ? this.occurrenceId.join(",")
          : this.occurrenceId,
      },
      data: {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        address: this.address,
        city: this.city,
        country: this.country,
        zip: this.zip,
        state: this.state,
        phone: this.phone,
        industry: this.industry,
        org: this.org,
        job_title: this.jobTitle,
        purchasing_time_frame: this.purchasingTimeFrame,
        role_in_purchase_process: this.roleInPurchaseProcess,
        number_of_employees: this.numberOfEmployees,
        comments: this.comments,
      },
    }));

    $.export("$summary", `"${this.firstName} ${this.lastName}" was successfully invited to the webinar, "${get(this.webinar, "label", this.webinar)}"`);

    return res;
  },
};
