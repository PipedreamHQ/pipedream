import zoom from "../../zoom.app.mjs";

export default {
  name: "List Call Recordings",
  description: "Get your account's call recordings. [See the documentation](https://developers.zoom.us/docs/api/rest/reference/phone/methods/#operation/getPhoneRecordings)",
  key: "zoom-list-call-recordings",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zoom,
    infoBox: {
      type: "alert",
      alertType: "info",
      content: "The Zoom API returns calls from the last 30 days by default. You can use the `Start Date` and `End Date` props to change this.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date/time in `yyyy-mm-dd` or `yyyy-MM-ddTHH:mm:ssZ` format. If `End Date` is not specified, calls made within a 30-day period starting on `Start Date` will be retrieved.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date/time in `yyyy-mm-dd` or `yyyy-MM-ddTHH:mm:ssZ` format. Calls made after `Start Date` and before `End Date` will be retrieved. Date range should be a maximum of 30 days.",
      optional: true,
    },
    max: {
      propDefinition: [
        zoom,
        "max",
      ],
      default: 30,
      min: 1,
      max: 300,
    },
  },
  async run ({ $ }) {
    const {
      zoom, startDate, endDate, max,
    } = this;
    let to = endDate;
    if (startDate && !endDate) {
      const date = new Date(startDate);
      if (isNaN(date.valueOf())) {
        throw new Error("Invalid format for `Start Date`. Please use `yyyy-mm-dd` or `yyyy-MM-ddTHH:mm:ssZ`.");
      }
      date.setDate(date.getDate() - 30);
      to = date.toISOString();
      if (!startDate.split("T")[1]) {
        to = to.split("T")[0];
      }
    }
    const { recordings } = await zoom.listCallRecordings({
      step: $,
      params: {
        page_size: max,
        from: startDate,
        to,
      },
    });

    $.export("$summary", `Successfully fetched ${recordings.length} call recordings`);

    return recordings;
  },
};
