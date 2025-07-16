import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-list-message-templates",
  name: "List Message Templates",
  description: "List the message templates. [See the documentation](https://dev.frontapp.com/reference/list-message-templates).",
  version: "0.0.1",
  type: "action",
  props: {
    frontApp,
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Field used to sort the message templates.",
      options: [
        "created_at",
        "updated_at",
        "sort_order",
      ],
      optional: true,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Order by which results should be sorted",
      options: [
        "asc",
        "desc",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      frontApp,
      sortBy,
      sortOrder,
    } = this;

    const params = {};

    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;

    const response = await frontApp.listMessageTemplates({
      params,
      $,
    });

    const templates = response._results || [];
    $.export("$summary", `Successfully retrieved ${templates.length} message template(s)`);

    return response;
  },
};
