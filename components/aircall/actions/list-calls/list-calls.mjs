import app from "../../aircall.app.mjs";

export default {
  name: "List Calls",
  description: "Retrieves a list of calls with optional filtering by date range, user, direction, and more. [See the docs here](https://developer.aircall.io/api-references/#list-all-calls)",
  key: "aircall-list-calls",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    from: {
      type: "integer",
      label: "From",
      description: "Unix timestamp. Fetch calls made after this date.",
      optional: true,
    },
    to: {
      type: "integer",
      label: "To",
      description: "Unix timestamp. Fetch calls made before this date.",
      optional: true,
    },
    userId: {
      type: "integer",
      label: "User ID",
      description: "Filter calls by a specific user ID.",
      optional: true,
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "Filter calls by direction.",
      options: [
        "inbound",
        "outbound",
      ],
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of calls to return per page (max 50).",
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Sort order for the results.",
      options: [
        "asc",
        "desc",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.from !== undefined) params.from = this.from;
    if (this.to !== undefined) params.to = this.to;
    if (this.userId !== undefined) params.user_id = this.userId;
    if (this.direction) params.direction = this.direction;
    if (this.perPage !== undefined) params.per_page = this.perPage;
    if (this.order) params.order = this.order;

    const { calls, meta } = await this.app.listCalls(params, $);

    $.export("$summary", `Successfully retrieved ${calls.length} call(s)`);

    return {
      calls,
      meta,
    };
  },
};
