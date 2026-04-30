import amazonSellingPartner from "../../amazon_selling_partner.app.mjs";

export default {
  key: "amazon_selling_partner-generate-sales-inventory-reports",
  name: "Generate Sales & Inventory Reports",
  description: "Requests reports on sales, inventory, and fulfillment performance. [See the documentation](https://developer-docs.amazon.com/sp-api/reference/getreports)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    amazonSellingPartner,
    reportTypes: {
      type: "string[]",
      label: "Report Types",
      description: "A list of report types used to filter reports. Refer to [Report Type Values](https://developer-docs.amazon.com/sp-api/docs/report-type-values) for more information.",
    },
    marketplaceId: {
      propDefinition: [
        amazonSellingPartner,
        "marketplaceId",
      ],
      optional: true,
    },
    processingStatuses: {
      type: "string[]",
      label: "Processing Statuses",
      description: "A list of processing statuses used to filter reports",
      options: [
        "CANCELLED",
        "DONE",
        "FATAL",
        "IN_PROGRESS",
        "IN_QUEUE",
      ],
      optional: true,
    },
    createdSince: {
      type: "string",
      label: "Created Since",
      description: "The earliest report creation date and time for reports to include in the response, in ISO 8601 date time format. The default is 90 days ago. Reports are retained for a maximum of 90 days.",
      optional: true,
    },
    createdUntil: {
      type: "string",
      label: "Created Until",
      description: "The latest report creation date and time for reports to include in the response, in ISO 8601 date time format. The default is now.",
      optional: true,
    },
  },
  async run({ $ }) {
    const reports = await this.amazonSellingPartner.getPaginatedResources({
      fn: this.amazonSellingPartner.listReports,
      params: {
        reportTypes: this.reportTypes
          ? this.reportTypes.join(",")
          : undefined,
        marketplaceIds: this.marketplaceId,
        processingStatuses: this.processingStatuses
          ? this.processingStatuses.join(",")
          : undefined,
        createdSince: this.createdSince,
        createdUntil: this.createdUntil,
      },
      resourceKey: "reports",
      hasPayload: false,
    });
    $.export("$summary", `Fetched ${reports.length} report${reports.length === 1
      ? ""
      : "s"}`);
    return reports;
  },
};
