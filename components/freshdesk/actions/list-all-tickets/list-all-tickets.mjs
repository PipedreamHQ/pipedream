import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-list-all-tickets",
  name: "List Tickets",
  description:
    "Fetch up to 100 tickets according to the selected filters. [See the documentation](https://developers.freshdesk.com/api/#list_all_tickets)",
  version: "0.2.8",
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
  },
  async run({ $ }) {
    const response = await this.freshdesk.listTickets({
      $,
      params: {
        order_by: this.orderBy,
        order_type: this.orderType,
      },
    });

    const { length } = response;
    $.export("$summary", `Successfully fetched ${length} ticket${length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
