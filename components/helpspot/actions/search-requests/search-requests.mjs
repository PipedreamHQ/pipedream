import {
  ANYALL_OPTIONS,
  FOPEN_OPTIONS,
  ORDER_DIR_OPTIONS,
} from "../../common/constants.mjs";
import helpspot from "../../helpspot.app.mjs";

export default {
  key: "helpspot-search-requests",
  name: "Search Requests",
  description: "Searches for support requests using one or more filter criteria. [See the documentation](https://support.helpspot.com/index.php?pg=kb.page&id=164#private.request.search)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helpspot,
    sSearch: {
      type: "string",
      label: "Search Text",
      description: "Full-text search string to match against request content.",
      optional: true,
    },
    anyall: {
      type: "string",
      label: "Match Mode",
      description: "Whether **all** filters must match (default) or **any** single filter is sufficient.",
      options: ANYALL_OPTIONS,
      optional: true,
    },
    xRequest: {
      propDefinition: [
        helpspot,
        "xRequest",
      ],
      optional: true,
    },
    xCategory: {
      propDefinition: [
        helpspot,
        "xCategory",
      ],
      optional: true,
    },
    xStatus: {
      propDefinition: [
        helpspot,
        "xStatus",
      ],
      optional: true,
    },
    fOpen: {
      type: "integer",
      label: "Open/Closed",
      description: "Filter by whether the request is open or closed.",
      options: FOPEN_OPTIONS,
      optional: true,
    },
    xPersonAssignedTo: {
      type: "string",
      label: "Assigned To",
      description: "The ID of the staff member the request is assigned to. Use the **List Active Staff** action to retrieve valid staff IDs.",
      optional: true,
    },
    sUserId: {
      type: "string",
      label: "User ID",
      description: "Filter by customer user ID, e.g., `user_12345`.",
      optional: true,
    },
    sFirstName: {
      type: "string",
      label: "First Name",
      description: "Filter by customer first name.",
      optional: true,
    },
    sLastName: {
      type: "string",
      label: "Last Name",
      description: "Filter by customer last name.",
      optional: true,
    },
    sEmail: {
      type: "string",
      label: "Email",
      description: "Filter by customer email address.",
      optional: true,
    },
    sPhone: {
      type: "string",
      label: "Phone",
      description: "Filter by customer phone number.",
      optional: true,
    },
    afterDate: {
      type: "string",
      label: "Opened After Date",
      description: "Return requests opened after this date. Provide a Unix timestamp or a valid date string (e.g. `2024-01-01`).",
      optional: true,
    },
    beforeDate: {
      type: "string",
      label: "Opened Before Date",
      description: "Return requests opened before this date. Provide a Unix timestamp or a valid date string (e.g. `2024-12-31`).",
      optional: true,
    },
    closedAfterDate: {
      type: "string",
      label: "Closed After Date",
      description: "Return requests closed after this date. Provide a Unix timestamp or a valid date string (e.g. `2024-01-01`).",
      optional: true,
    },
    closedBeforeDate: {
      type: "string",
      label: "Closed Before Date",
      description: "Return requests closed before this date. Provide a Unix timestamp or a valid date string (e.g. `2024-12-31`).",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Field name to sort results by (e.g. `xRequest`, `sLastName`, `dtGMTOpened`).",
      optional: true,
    },
    orderByDir: {
      type: "string",
      label: "Order Direction",
      description: "Sort direction for the `Order By` field.",
      options: ORDER_DIR_OPTIONS,
      optional: true,
    },
    length: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of requests to return.",
      optional: true,
    },
    fRawValues: {
      type: "boolean",
      label: "Raw Values",
      description: "Set to `true` to return numeric IDs instead of their text representations.",
      optional: true,
    },
    fIncludeTimeTotal: {
      type: "boolean",
      label: "Include Time Total",
      description: "Set to `true` to include total tracked time as `iTimeTotal` (seconds) and `sTimeTotal` (formatted string) in each result.",
      optional: true,
    },
  },
  async run({ $ }) {
    const toTimestamp = (val) => {
      if (!val) return undefined;
      const parsed = Number(val);
      if (!isNaN(parsed)) return parsed;
      const ts = Math.floor(new Date(val).getTime() / 1000);
      if (isNaN(ts)) throw new Error(`Invalid date value: "${val}"`);
      return ts;
    };

    const response = await this.helpspot.listRequests({
      $,
      params: {
        anyall: this.anyall,
        xRequest: this.xRequest,
        sSearch: this.sSearch,
        xCategory: this.xCategory,
        xStatus: this.xStatus,
        fOpen: this.fOpen,
        xPersonAssignedTo: this.xPersonAssignedTo,
        sUserId: this.sUserId,
        sFirstName: this.sFirstName,
        sLastName: this.sLastName,
        sEmail: this.sEmail,
        sPhone: this.sPhone,
        afterDate: toTimestamp(this.afterDate),
        beforeDate: toTimestamp(this.beforeDate),
        closedAfterDate: toTimestamp(this.closedAfterDate),
        closedBeforeDate: toTimestamp(this.closedBeforeDate),
        orderBy: this.orderBy,
        orderByDir: this.orderByDir,
        length: this.length,
        ...(this.fRawValues !== undefined && {
          fRawValues: +this.fRawValues,
        }),
        ...(this.fIncludeTimeTotal !== undefined && {
          fIncludeTimeTotal: +this.fIncludeTimeTotal,
        }),
      },
    });

    const requests = response?.request ?? [];
    const count = Array.isArray(requests)
      ? requests.length
      : 1;
    $.export("$summary", `Successfully retrieved ${count} request${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
