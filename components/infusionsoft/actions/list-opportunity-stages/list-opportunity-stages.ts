import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Opportunity Stages",
  description:
    "List opportunity stages in Keap CRM with optional filtering. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Opportunity-Stage)",
  key: "infusionsoft-list-opportunity-stages",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    infusionsoft,
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Order stages by stage_order",
      optional: true,
      options: [
        {
          label: "Stage Order (Ascending)",
          value: "stage_order asc",
        },
        {
          label: "Stage Order (Descending)",
          value: "stage_order desc",
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
    const result = await this.infusionsoft.listOpportunityStages({
      $,
      orderBy: this.orderBy,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
    });

    const count = (result as { stages?: unknown[] }).stages?.length ?? 0;
    $.export("$summary", `Retrieved ${count} opportunity stage(s)`);

    return result;
  },
});
