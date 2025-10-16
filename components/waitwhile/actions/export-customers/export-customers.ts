import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Export Customers",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "waitwhile-export-customers",
  description: "Export Customers to CSV or JSON format. [See the doc here](https://developers.waitwhile.com/reference/getcustomersexport)",
  props: {
    waitwhile,
    format: {
      label: "Format",
      type: "string",
      options: [
        "CSV",
        "JSON",
      ],
      description: "Export format, CSV or JSON",
    },
    locationId: {
      propDefinition: [
        waitwhile,
        "locationId",
      ],
    },
    fromDate: {
      propDefinition: [
        waitwhile,
        "fromDate",
      ],
    },
    toDate: {
      propDefinition: [
        waitwhile,
        "toDate",
      ],
    },
    dateRangeField: {
      label: "Date Range Field",
      type: "string",
      optional: true,
      description: "The type of date to filter customer on. The create date or the last date it was updated (created or updated).",
    },
    fromTime: {
      propDefinition: [
        waitwhile,
        "fromTime",
      ],
    },
    toTime: {
      propDefinition: [
        waitwhile,
        "toTime",
      ],
    },

  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const params = {
      format: this.format,
      locationId: this.locationId,
      fromDate: this.fromDate,
      toDate: this.toDate,
      dateRangeField: this.dateRangeField,
      fromTime: this.fromTime,
      toTime: this.toTime,
    };

    try {
      const data = await this.waitwhile.exportCustomers(params);
      $.export("summary", "Successfully exported a customer");
      return data;
    } catch (error) {
      const statusCode = error[Object.getOwnPropertySymbols(error)[1]].status;
      const statusText = error[Object.getOwnPropertySymbols(error)[1]].statusText;
      throw new Error(`Error status code: ${statusCode}. Error status response: ${statusText}. You might need a Waitwhile Paid Plan to use this action`);
    }
  },
});
