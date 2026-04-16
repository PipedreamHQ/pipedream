import app from "../../connectwise_psa.app.mjs";

export default {
  key: "connectwise_psa-list-time-entries",
  name: "List Time Entries",
  description: "Retrieves a list of time entries. [See the documentation](https://developer.connectwise.com/Products/ConnectWise_PSA/REST#/TimeEntries/getTimeEntries)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    conditions: {
      type: "string",
      label: "Conditions",
      description: "Conditions to filter the time entries. E.g., `member/identifier=\"username\"` or `chargeToId=123 AND chargeToType=\"ServiceTicket\"`. [See the documentation](https://developer.connectwise.com/Products/ConnectWise_PSA/Developer_Guide) for more information.",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Field to order results by. E.g., `id desc` or `timeStart asc`",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of fields to return. E.g., `id,timeStart,timeEnd,member`",
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of results to return per page (max 1000)",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to retrieve (1-based)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      conditions,
      orderBy,
      fields,
      pageSize,
      page,
    } = this;

    const response = await app.listTimeEntries({
      $,
      params: {
        conditions,
        orderBy,
        fields,
        pageSize,
        page,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response.length}\` time entr${response.length === 1
      ? "y"
      : "ies"}`);
    return response;
  },
};
