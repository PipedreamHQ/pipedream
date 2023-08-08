import { defineAction } from "@pipedream/types";
import app from "../../app/zoho_assist.app";
import { GetSessionReportsParams } from "../../common/types";
import { GET_SESSION_REPORTS_TYPE_OPTIONS } from "../../common/constants";

export default defineAction({
  name: "Get Session Reports",
  description: "Fetch the reports of previously conducted sessions. [See the documentation](https://www.zoho.com/assist/api/getsessionreports.html)",
  key: "zoho_assist-get-session-reports",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    type: {
      propDefinition: [
        app,
        "type",
      ],
      options: GET_SESSION_REPORTS_TYPE_OPTIONS,
    },
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Long (Unix Timestamp).",
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "Long (Unix Timestamp).",
    },
    email: {
      type: "string",
      label: "Email",
      description:
        "To fetch reports conducted by specific technician.",
      optional: true,
    },
    index: {
      type: "string",
      label: "Index",
      description:
        "Index of the record.",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description:
        "Number of rows per page.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      type,
      fromDate,
      toDate,
      email,
      index,
      count,
    } = this;

    const params: GetSessionReportsParams = {
      $,
      params: {
        type,
        fromdate: fromDate,
        todate: toDate,
        email,
        index,
        count,
      },
    };

    const { representation } = await this.app.getSessionReports(params);

    $.export("$summary", `Successfully fetched ${representation.length} session reports`);

    return representation;
  },
});
