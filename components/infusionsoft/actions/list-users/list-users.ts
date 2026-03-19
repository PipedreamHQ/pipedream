import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Users",
  description:
    "List users in Keap CRM with optional filtering. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/User)",
  key: "infusionsoft-list-users",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    infusionsoft,
    email: {
      type: "string",
      label: "Email",
      description: "Filter users by email address.",
      optional: true,
    },
    givenName: {
      type: "string",
      label: "Given Name",
      description: "Filter users by first name.",
      optional: true,
    },
    userIds: {
      type: "string",
      label: "User IDs",
      description: "Filter by specific user IDs (comma-separated).",
      optional: true,
    },
    includeInactive: {
      type: "boolean",
      label: "Include Inactive",
      description: "Include inactive users in the results.",
      optional: true,
      default: false,
    },
    includePartners: {
      type: "boolean",
      label: "Include Partners",
      description: "Include partner users in the results.",
      optional: true,
      default: false,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Field and direction to order results.",
      optional: true,
      options: [
        {
          label: "Date Created (Ascending)",
          value: "CREATE_TIME asc",
        },
        {
          label: "Date Created (Descending)",
          value: "CREATE_TIME desc",
        },
        {
          label: "Email (Ascending)",
          value: "EMAIL asc",
        },
        {
          label: "Email (Descending)",
          value: "EMAIL desc",
        },
      ],
    },
    pageSize: {
      type: "string",
      label: "Page Size",
      description: "Number of results per page (1-100, default: 10).",
      optional: true,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "Token for fetching the next page of results.",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const userIds = this.userIds?.replace(/;/g, ",") ?? undefined;
    const result = await this.infusionsoft.listUsers({
      $,
      email: this.email,
      givenName: this.givenName,
      userIds,
      includeInactive: this.includeInactive,
      includePartners: this.includePartners,
      orderBy: this.orderBy,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
    });

    const count = (result as { users?: unknown[] }).users?.length ?? 0;
    $.export("$summary", `Retrieved ${count} user(s)`);

    return result;
  },
});
