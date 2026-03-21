import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-list-job-payments",
  name: "List Job Payments",
  description: "List Job Payment records with optional filtering. [See the documentation](https://developer.servicem8.com/reference/listjobpayments)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    servicem8: app,
    filter: {
      propDefinition: [
        app,
        "filter",
      ],
    },
    sort: {
      propDefinition: [
        app,
        "sort",
      ],
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const params = this.servicem8.buildListQueryParams({
      filter: this.filter,
      sort: this.sort,
      cursor: this.cursor,
    });
    const response = await this.servicem8.listResource({
      $,
      resource: "jobpayment",
      params,
    });
    $.export("$summary", "Successfully retrieved Job Payment records");
    return response;
  },
};
