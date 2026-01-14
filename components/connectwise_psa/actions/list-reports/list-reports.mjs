import app from "../../connectwise_psa.app.mjs";

export default {
  key: "connectwise_psa-list-reports",
  name: "List Reports",
  description: "Retrieves a list of available reports. [See the documentation](https://developer.connectwise.com/Products/ConnectWise_PSA/REST#/Reports/getSystemReports)",
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
      description: "Conditions to filter the reports. E.g., `name contains \"Sales\"`. [See the documentation](https://developer.connectwise.com/Products/ConnectWise_PSA/Developer_Guide) for more information.",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Field to order results by. E.g., `name asc` or `id desc`",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of fields to return. E.g., `id,name,reportUrl`",
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

    const response = await app.listReports({
      $,
      params: {
        conditions,
        orderBy,
        fields,
        pageSize,
        page,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response.length}\` report(s)`);
    return response;
  },
};
