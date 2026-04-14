import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Companies",
  description:
    "Search for and list all the companies that match by filters. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Company/operation/listCompanies)",
  key: "infusionsoft-list-companies",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    infusionsoft,
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Filter companies by name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Filter companies by email",
      optional: true,
    },
    sinceTime: {
      type: "string",
      label: "Since Time",
      description: "Filter companies created/updated after this time (ISO 8601 format)",
      optional: true,
    },
    untilTime: {
      type: "string",
      label: "Until Time",
      description: "Filter companies created/updated before this time (ISO 8601 format)",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated company properties to include (e.g., id,company_name,email_address)",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Field and direction to order results",
      optional: true,
      options: [
        {
          label: "ID (Ascending)",
          value: "id asc",
        },
        {
          label: "ID (Descending)",
          value: "id desc",
        },
        {
          label: "Create Time (Ascending)",
          value: "create_time asc",
        },
        {
          label: "Create Time (Descending)",
          value: "create_time desc",
        },
        {
          label: "Name (Ascending)",
          value: "name asc",
        },
        {
          label: "Name (Descending)",
          value: "name desc",
        },
        {
          label: "Email (Ascending)",
          value: "email asc",
        },
        {
          label: "Email (Descending)",
          value: "email desc",
        },
      ],
    },
    pageSize: {
      type: "string",
      label: "Page Size",
      description: "Number of results per page (1-1000)",
      optional: true,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "Token for fetching the next page of results",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const result = await this.infusionsoft.listCompaniesV2({
      $,
      companyName: this.companyName,
      email: this.email,
      sinceTime: this.sinceTime,
      untilTime: this.untilTime,
      fields: this.fields,
      orderBy: this.orderBy,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
    });

    const count = (result as { companies?: unknown[] }).companies?.length ?? 0;
    $.export("$summary", `Retrieved ${count} ${count === 1
      ? "company"
      : "companies"}`);

    return result;
  },
});
