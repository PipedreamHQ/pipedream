import zoomAdmin from "../../zoom_admin.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  name: "List Call Logs",
  description: "List call logs of a user within a month. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-phone-api/call-logs/phoneusercalllogs)",
  key: "zoom-admin-action-list-call-logs",
  version: "0.0.2",
  type: "action",
  props: {
    zoomAdmin,
    from: {
      type: "string",
      label: "From",
      description: "Start date in `yyyy-mm-dd` format. The date range defined by the `from` and `to` parameters should only be **one month** as the report includes only one month worth of data at once.",
    },
    to: {
      type: "string",
      label: "To",
      description: "End date in `yyyy-mm-dd` UTC format.",
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
    type: {
      type: "string",
      label: "Type",
      description: "The call type",
      optional: true,
      options: [
        "all",
        "missed",
      ],
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Filter API responses to include call logs of only the phone number defined in this field.",
      optional: true,
    },
    timeType: {
      type: "string",
      label: "Time Type",
      description: "Enables you to sort call logs by start or end time. Choose the sort time value.",
      optional: true,
      options: [
        "startTime",
        "endTime",
      ],
    },
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "GET",
      path: "/phone/users/me/call_logs",
      params: {
        page_size: this.pageSize,
        next_page_token: this.nextPageToken,
        from: this.from,
        to: this.to,
        type: this.type,
        phone_number: this.phoneNumber,
        time_type: this.timeType,
      },
    }));

    $.export("$summary", "Call logs successfully fetched");

    return res;
  },
};
