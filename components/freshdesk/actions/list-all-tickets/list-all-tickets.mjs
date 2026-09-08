import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-list-all-tickets",
  name: "List Tickets",
  description:
    "Fetch up to 100 tickets according to the selected filters. [See the documentation](https://developers.freshdesk.com/api/#list_all_tickets)",
  version: "0.2.15",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshdesk,
    orderBy: {
      type: "string",
      label: "Sort By",
      description: "Which field to sort tickets by. Defaults to `Created At`",
      optional: true,
      options: [
        {
          value: "created_at",
          label: "Created At",
        },
        {
          value: "due_by",
          label: "Due By",
        },
        {
          value: "updated_at",
          label: "Updated At",
        },
        {
          value: "status",
          label: "Status",
        },
      ],
    },
    orderType: {
      type: "string",
      label: "Sort Order",
      description:
        "Whether to sort in ascending or descending order. Defaults to descending",
      optional: true,
      options: [
        {
          label: "Ascending",
          value: "asc",
        },
        {
          label: "Descending",
          value: "desc",
        },
      ],
    },
    requesterId: {
      type: "integer",
      label: "Requester ID",
      description:
        "Filter by the numeric Freshdesk requester ID, for example `12345`. Obtain it from the Freshdesk requester record or API.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description:
        "Filter by the requester's email address, for example `user@example.com`.",
      optional: true,
    },
    companyId: {
      type: "integer",
      label: "Company ID",
      description:
        "Filter by the numeric Freshdesk company ID, for example `67890`. Obtain it from the Freshdesk company record or API.",
      optional: true,
    },
    updatedSince: {
      type: "string",
      label: "Updated Since",
      description: "Filter tickets updated since the specified date and time in ISO 8601 format (e.g., `2024-01-01T00:00:00Z`).",
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of tickets to return per page. Must be between 1 and 100.",
      min: 1,
      max: 100,
      optional: true,
    },
    include: {
      type: "string[]",
      label: "Include",
      description:
        "Optional array of response fields. Supported values are `description`, `requester`, and `stats`; for example, `['description', 'requester']`.",
      optional: true,
      options: [
        "description",
        "requester",
        "stats",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.freshdesk.listTickets({
      $,
      params: {
        order_by: this.orderBy,
        order_type: this.orderType,
        requester_id: this.requesterId,
        email: this.email,
        company_id: this.companyId,
        updated_since: this.updatedSince,
        per_page: this.perPage,
        include: this.include
          ? this.include.join(",")
          : undefined,
      },
    });

    const { length } = response;
    $.export("$summary", `Successfully fetched ${length} ticket${length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
