import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Opportunities",
  description:
    "List opportunities with optional filters. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Opportunity/operation/listOpportunities)",
  key: "infusionsoft-list-opportunities",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    infusionsoft,
    stageId: {
      type: "string",
      label: "Stage ID",
      description: "Filter opportunities by stage ID",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Filter opportunities by owner user ID",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated additional fields (e.g., custom_fields,projected_revenue_high)",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Field and direction to order results",
      optional: true,
      options: [
        {
          label: "Next Action Time (Ascending)",
          value: "next_action_time asc",
        },
        {
          label: "Next Action Time (Descending)",
          value: "next_action_time desc",
        },
        {
          label: "Contact Name (Ascending)",
          value: "contact_name asc",
        },
        {
          label: "Contact Name (Descending)",
          value: "contact_name desc",
        },
        {
          label: "Opportunity Name (Ascending)",
          value: "opportunity_name asc",
        },
        {
          label: "Opportunity Name (Descending)",
          value: "opportunity_name desc",
        },
        {
          label: "Created Time (Ascending)",
          value: "created_time asc",
        },
        {
          label: "Created Time (Descending)",
          value: "created_time desc",
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
    const result = await this.infusionsoft.listOpportunities({
      $,
      stageId: this.stageId,
      userId: this.userId,
      fields: this.fields,
      orderBy: this.orderBy,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
    });

    const count = (result as { opportunities?: unknown[] }).opportunities?.length ?? 0;
    $.export("$summary", `Retrieved ${count} ${count === 1
      ? "opportunity"
      : "opportunities"}`);

    return result;
  },
});
