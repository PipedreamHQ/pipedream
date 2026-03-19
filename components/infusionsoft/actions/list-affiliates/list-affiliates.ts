import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Affiliates",
  description:
    "List affiliates with optional filters in Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Affiliate/operation/listAffiliate)",
  key: "infusionsoft-list-affiliates",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    infusionsoft,
    affiliateName: {
      type: "string",
      label: "Affiliate Name",
      description: "Filter affiliates by name",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Filter affiliates by contact ID",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter affiliates by status",
      optional: true,
      options: [
        {
          label: "Active",
          value: "ACTIVE",
        },
        {
          label: "Inactive",
          value: "INACTIVE",
        },
      ],
    },
    code: {
      type: "string",
      label: "Affiliate Code",
      description: "Filter affiliates by code",
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
          label: "Name (Ascending)",
          value: "name asc",
        },
        {
          label: "Name (Descending)",
          value: "name desc",
        },
        {
          label: "Code (Ascending)",
          value: "code asc",
        },
        {
          label: "Code (Descending)",
          value: "code desc",
        },
        {
          label: "Create Time (Ascending)",
          value: "create_time asc",
        },
        {
          label: "Create Time (Descending)",
          value: "create_time desc",
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
    const result = await this.infusionsoft.listAffiliates({
      $,
      affiliateName: this.affiliateName,
      contactId: this.contactId,
      status: this.status,
      code: this.code,
      orderBy: this.orderBy,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
    });

    const count = (result as { affiliates?: unknown[] }).affiliates?.length ?? 0;
    $.export("$summary", `Retrieved ${count} affiliate(s)`);

    return result;
  },
});
